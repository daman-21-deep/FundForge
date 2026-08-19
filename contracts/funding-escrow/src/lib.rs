#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, token,
    Address, BytesN, Env,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InvalidGoal = 3,
    InvalidDeadline = 4,
    InvalidAmount = 5,
    DeadlinePassed = 6,
    CampaignActive = 7,
    GoalNotReached = 8,
    GoalAlreadyReached = 9,
    AlreadyClaimed = 10,
    NoContribution = 11,
    NotActive = 12,
    AlreadyCancelled = 13,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EscrowState {
    Active,
    Successful,
    Failed,
    Cancelled,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Initialized,
    Token,
    Creator,
    Goal,
    Deadline,
    TotalRaised,
    Withdrawn,
    State,
    Contributor(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EscrowMetadata {
    pub token: Address,
    pub creator: Address,
    pub goal: i128,
    pub deadline: u64,
    pub total_raised: i128,
    pub withdrawn: bool,
    pub state: EscrowState,
}

#[contract]
pub struct FundingEscrowContract;

#[contractimpl]
impl FundingEscrowContract {
    /// Initialize the escrow contract parameters. Can only be initialized once.
    pub fn initialize(env: Env, token: Address, creator: Address, goal: i128, deadline: u64) {
        if env.storage().instance().has(&DataKey::Initialized) {
            panic_with_error!(&env, Error::AlreadyInitialized);
        }
        if goal <= 0 {
            panic_with_error!(&env, Error::InvalidGoal);
        }
        if deadline <= env.ledger().timestamp() {
            panic_with_error!(&env, Error::InvalidDeadline);
        }

        env.storage().instance().set(&DataKey::Initialized, &true);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Creator, &creator);
        env.storage().instance().set(&DataKey::Goal, &goal);
        env.storage().instance().set(&DataKey::Deadline, &deadline);
        env.storage().instance().set(&DataKey::TotalRaised, &0i128);
        env.storage().instance().set(&DataKey::Withdrawn, &false);
        env.storage()
            .instance()
            .set(&DataKey::State, &EscrowState::Active);

        // Extend instance storage lease (Soroban TTL)
        env.storage().instance().extend_ttl(5000, 10000);
    }

    /// Upgrades the smart contract bytecode. Only the Campaign Creator is authorized to execute this.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let creator: Address = env
            .storage()
            .instance()
            .get(&DataKey::Creator)
            .unwrap_or_else(|| panic_with_error!(&env, Error::NotInitialized));
        creator.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }

    /// Returns the current state of the campaign escrow.
    pub fn get_state(env: Env) -> EscrowState {
        let state: Option<EscrowState> = env.storage().instance().get(&DataKey::State);
        if let Some(EscrowState::Cancelled) = state {
            return EscrowState::Cancelled;
        }

        let withdrawn: bool = env
            .storage()
            .instance()
            .get(&DataKey::Withdrawn)
            .unwrap_or(false);
        if withdrawn {
            return EscrowState::Successful;
        }

        let total_raised: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalRaised)
            .unwrap_or(0);
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap_or(0);
        let deadline: u64 = env
            .storage()
            .instance()
            .get(&DataKey::Deadline)
            .unwrap_or(0);

        if total_raised >= goal {
            EscrowState::Successful
        } else if env.ledger().timestamp() >= deadline {
            EscrowState::Failed
        } else {
            EscrowState::Active
        }
    }

    /// Allows campaign creator to cancel an active campaign before funding goal or deadline is reached.
    pub fn cancel_campaign(env: Env) {
        let creator: Address = env
            .storage()
            .instance()
            .get(&DataKey::Creator)
            .unwrap_or_else(|| panic_with_error!(&env, Error::NotInitialized));
        creator.require_auth();

        let current_state = Self::get_state(env.clone());
        if current_state != EscrowState::Active {
            panic_with_error!(&env, Error::NotActive);
        }

        env.storage()
            .instance()
            .set(&DataKey::State, &EscrowState::Cancelled);

        env.events()
            .publish((symbol_short!("cancel"), creator), env.ledger().timestamp());

        env.storage().instance().extend_ttl(5000, 10000);
    }

    /// Contributes XLM/Token to the campaign.
    pub fn fund(env: Env, contributor: Address, amount: i128) {
        contributor.require_auth();

        let initialized: bool = env
            .storage()
            .instance()
            .get(&DataKey::Initialized)
            .unwrap_or(false);
        if !initialized {
            panic_with_error!(&env, Error::NotInitialized);
        }

        let current_state = Self::get_state(env.clone());
        if current_state != EscrowState::Active {
            panic_with_error!(&env, Error::NotActive);
        }

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() >= deadline {
            panic_with_error!(&env, Error::DeadlinePassed);
        }
        if amount <= 0 {
            panic_with_error!(&env, Error::InvalidAmount);
        }

        // Fetch current total raised & contributor previous contributions
        let mut total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let contributor_key = DataKey::Contributor(contributor.clone());
        let prev_contrib: i128 = env
            .storage()
            .persistent()
            .get(&contributor_key)
            .unwrap_or(0);

        // Perform token transfer to this contract address
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&contributor, &env.current_contract_address(), &amount);

        // Update state
        let new_contrib = prev_contrib + amount;
        env.storage()
            .persistent()
            .set(&contributor_key, &new_contrib);

        total_raised += amount;
        env.storage()
            .instance()
            .set(&DataKey::TotalRaised, &total_raised);

        // Emit real-time event
        env.events()
            .publish((symbol_short!("fund"), contributor.clone()), amount);

        // Extend storage TTLs
        env.storage().instance().extend_ttl(5000, 10000);
        env.storage()
            .persistent()
            .extend_ttl(&contributor_key, 5000, 10000);
    }

    /// Creator claims the funds if campaign succeeded and deadline has passed.
    pub fn claim_funds(env: Env) {
        let initialized: bool = env
            .storage()
            .instance()
            .get(&DataKey::Initialized)
            .unwrap_or(false);
        if !initialized {
            panic_with_error!(&env, Error::NotInitialized);
        }

        let creator: Address = env.storage().instance().get(&DataKey::Creator).unwrap();
        creator.require_auth();

        let withdrawn: bool = env.storage().instance().get(&DataKey::Withdrawn).unwrap();
        if withdrawn {
            panic_with_error!(&env, Error::AlreadyClaimed);
        }

        let current_state = Self::get_state(env.clone());
        if current_state == EscrowState::Cancelled {
            panic_with_error!(&env, Error::AlreadyCancelled);
        }

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() < deadline {
            panic_with_error!(&env, Error::CampaignActive);
        }

        let total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        if total_raised < goal {
            panic_with_error!(&env, Error::GoalNotReached);
        }

        // Set withdrawn flag to prevent double spending
        env.storage().instance().set(&DataKey::Withdrawn, &true);

        // Transfer funds from contract to creator
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&env.current_contract_address(), &creator, &total_raised);

        // Emit real-time completion event
        env.events()
            .publish((symbol_short!("finish"), creator), total_raised);
    }

    /// Contributor claims refund if campaign failed or was cancelled.
    pub fn claim_refund(env: Env, contributor: Address) {
        contributor.require_auth();

        let initialized: bool = env
            .storage()
            .instance()
            .get(&DataKey::Initialized)
            .unwrap_or(false);
        if !initialized {
            panic_with_error!(&env, Error::NotInitialized);
        }

        let current_state = Self::get_state(env.clone());

        // Refunds allowed if Cancelled OR if Active/Failed after deadline when goal is not met
        if current_state == EscrowState::Cancelled {
            // Cancelled campaigns allow immediate refund
        } else {
            let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
            if env.ledger().timestamp() < deadline {
                panic_with_error!(&env, Error::CampaignActive);
            }

            let total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
            let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
            if total_raised >= goal {
                panic_with_error!(&env, Error::GoalAlreadyReached);
            }
        }

        let contributor_key = DataKey::Contributor(contributor.clone());
        let contribution: i128 = env
            .storage()
            .persistent()
            .get(&contributor_key)
            .unwrap_or(0);
        if contribution <= 0 {
            panic_with_error!(&env, Error::NoContribution);
        }

        // Reset contributor's balance inside state
        env.storage().persistent().set(&contributor_key, &0i128);

        // Transfer refund back
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&env.current_contract_address(), &contributor, &contribution);

        // Emit refund event
        env.events()
            .publish((symbol_short!("refund"), contributor), contribution);
    }

    /// Read campaign metadata.
    pub fn get_metadata(env: Env) -> EscrowMetadata {
        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let creator: Address = env.storage().instance().get(&DataKey::Creator).unwrap();
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        let total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let withdrawn: bool = env
            .storage()
            .instance()
            .get(&DataKey::Withdrawn)
            .unwrap_or(false);
        let state = Self::get_state(env.clone());

        EscrowMetadata {
            token,
            creator,
            goal,
            deadline,
            total_raised,
            withdrawn,
            state,
        }
    }

    /// Read contributor contribution.
    pub fn get_contribution(env: Env, contributor: Address) -> i128 {
        let contributor_key = DataKey::Contributor(contributor);
        env.storage()
            .persistent()
            .get(&contributor_key)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
