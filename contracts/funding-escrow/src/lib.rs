#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, token, BytesN};

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
}

#[contract]
pub struct FundingEscrowContract;

#[contractimpl]
impl FundingEscrowContract {
    /// Initialize the escrow contract parameters. Can only be initialized once.
    pub fn initialize(
        env: Env,
        token: Address,
        creator: Address,
        goal: i128,
        deadline: u64,
    ) {
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("Contract already initialized");
        }
        if goal <= 0 {
            panic!("Goal must be positive");
        }
        if deadline <= env.ledger().timestamp() {
            panic!("Deadline must be in the future");
        }

        env.storage().instance().set(&DataKey::Initialized, &true);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Creator, &creator);
        env.storage().instance().set(&DataKey::Goal, &goal);
        env.storage().instance().set(&DataKey::Deadline, &deadline);
        env.storage().instance().set(&DataKey::TotalRaised, &0i128);
        env.storage().instance().set(&DataKey::Withdrawn, &false);
        
        // Extend instance storage lease (Soroban TTL)
        env.storage().instance().extend_ttl(5000, 10000);
    }

    /// Upgrades the smart contract bytecode. Only the Campaign Creator is authorized to execute this.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let creator: Address = env.storage().instance().get(&DataKey::Creator).expect("Creator not configured");
        creator.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }

    /// Contributes XLM/Token to the campaign.
    pub fn fund(env: Env, contributor: Address, amount: i128) {
        contributor.require_auth();

        let initialized: bool = env.storage().instance().get(&DataKey::Initialized).unwrap_or(false);
        if !initialized {
            panic!("Contract not initialized");
        }

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() >= deadline {
            panic!("Campaign deadline has passed");
        }
        if amount <= 0 {
            panic!("Amount must be greater than zero");
        }

        // Fetch current total raised & contributor previous contributions
        let mut total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let contributor_key = DataKey::Contributor(contributor.clone());
        let prev_contrib: i128 = env.storage().persistent().get(&contributor_key).unwrap_or(0);

        // Perform token transfer to this contract address
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&contributor, &env.current_contract_address(), &amount);

        // Update state
        let new_contrib = prev_contrib + amount;
        env.storage().persistent().set(&contributor_key, &new_contrib);
        
        total_raised += amount;
        env.storage().instance().set(&DataKey::TotalRaised, &total_raised);

        // Emit real-time event
        env.events().publish(
            (symbol_short!("fund"), contributor.clone()),
            amount,
        );

        // Extend storage TTLs
        env.storage().instance().extend_ttl(5000, 10000);
        env.storage().persistent().extend_ttl(&contributor_key, 5000, 10000);
    }

    /// Creator claims the funds if campaign succeeded and deadline has passed.
    pub fn claim_funds(env: Env) {
        let initialized: bool = env.storage().instance().get(&DataKey::Initialized).unwrap_or(false);
        if !initialized {
            panic!("Contract not initialized");
        }

        let creator: Address = env.storage().instance().get(&DataKey::Creator).unwrap();
        creator.require_auth();

        let withdrawn: bool = env.storage().instance().get(&DataKey::Withdrawn).unwrap();
        if withdrawn {
            panic!("Funds already claimed");
        }

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() < deadline {
            panic!("Campaign is still active");
        }

        let total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        if total_raised < goal {
            panic!("Campaign goal not reached");
        }

        // Set withdrawn flag to prevent double spending
        env.storage().instance().set(&DataKey::Withdrawn, &true);

        // Transfer funds from contract to creator
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&env.current_contract_address(), &creator, &total_raised);

        // Emit real-time completion event
        env.events().publish(
            (symbol_short!("finish"), creator),
            total_raised,
        );
    }

    /// Contributor claims refund if campaign failed and deadline has passed.
    pub fn claim_refund(env: Env, contributor: Address) {
        contributor.require_auth();

        let initialized: bool = env.storage().instance().get(&DataKey::Initialized).unwrap_or(false);
        if !initialized {
            panic!("Contract not initialized");
        }

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() < deadline {
            panic!("Campaign is still active");
        }

        let total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        if total_raised >= goal {
            panic!("Campaign succeeded, refund not available");
        }

        let contributor_key = DataKey::Contributor(contributor.clone());
        let contribution: i128 = env.storage().persistent().get(&contributor_key).unwrap_or(0);
        if contribution <= 0 {
            panic!("No contribution found for this address");
        }

        // Reset contributor's balance inside state
        env.storage().persistent().set(&contributor_key, &0i128);

        // Transfer refund back
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&env.current_contract_address(), &contributor, &contribution);

        // Emit refund event
        env.events().publish(
            (symbol_short!("refund"), contributor),
            contribution,
        );
    }

    /// Read campaign metadata.
    pub fn get_metadata(env: Env) -> EscrowMetadata {
        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let creator: Address = env.storage().instance().get(&DataKey::Creator).unwrap();
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        let total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let withdrawn: bool = env.storage().instance().get(&DataKey::Withdrawn).unwrap_or(false);

        EscrowMetadata {
            token,
            creator,
            goal,
            deadline,
            total_raised,
            withdrawn,
        }
    }

    /// Read contributor contribution.
    pub fn get_contribution(env: Env, contributor: Address) -> i128 {
        let contributor_key = DataKey::Contributor(contributor);
        env.storage().persistent().get(&contributor_key).unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
