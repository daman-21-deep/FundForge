#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, BytesN, Env, IntoVal, String, Val, Vec
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CampaignInfo {
    pub id: u32,
    pub creator: Address,
    pub title: String,
    pub goal: i128,
    pub deadline: u64,
    pub escrow_address: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Initialized,
    Admin,
    NextId,
    Campaigns,
}

#[contract]
pub struct CampaignRegistryContract;

#[contractimpl]
impl CampaignRegistryContract {
    /// Initialize the Registry with an Admin address.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("Registry already initialized");
        }
        env.storage().instance().set(&DataKey::Initialized, &true);
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NextId, &1u32);
        env.storage().instance().set(&DataKey::Campaigns, &Vec::<CampaignInfo>::new(&env));
        env.storage().instance().extend_ttl(5000, 10000);
    }

    /// Upgrades the smart contract bytecode. Only the Admin is authorized to execute this.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Admin not configured");
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }

    /// Deploys a new Funding Escrow contract, initializes it, and registers the campaign metadata.
    pub fn create_campaign(
        env: Env,
        token: Address,
        creator: Address,
        title: String,
        goal: i128,
        deadline: u64,
        escrow_wasm_hash: BytesN<32>,
    ) -> Address {
        creator.require_auth();

        let initialized: bool = env.storage().instance().get(&DataKey::Initialized).unwrap_or(false);
        if !initialized {
            panic!("Registry not initialized");
        }

        let mut next_id: u32 = env.storage().instance().get(&DataKey::NextId).unwrap_or(1);
        let mut campaigns: Vec<CampaignInfo> = env.storage().instance().get(&DataKey::Campaigns).unwrap();

        // Generate deployment salt using registry counter increment
        let mut salt_bytes = [0u8; 32];
        salt_bytes[0..4].copy_from_slice(&next_id.to_be_bytes());
        let salt = BytesN::from_array(&env, &salt_bytes);

        // Dynamically deploy the Funding Escrow Contract on-chain
        let escrow_address = env
            .deployer()
            .with_current_contract(salt)
            .deploy(escrow_wasm_hash);

        // Prepare arguments for Funding Escrow contract initialization
        let init_args: Vec<Val> = vec![
            &env,
            token.into_val(&env),
            creator.into_val(&env),
            goal.into_val(&env),
            deadline.into_val(&env),
        ];

        // Call the newly deployed Funding Escrow contract via inter-contract call
        env.invoke_contract::<()>(
            &escrow_address,
            &soroban_sdk::Symbol::new(&env, "initialize"),
            init_args,
        );

        // Register campaign info
        let campaign_info = CampaignInfo {
            id: next_id,
            creator: creator.clone(),
            title: title.clone(),
            goal,
            deadline,
            escrow_address: escrow_address.clone(),
        };
        campaigns.push_back(campaign_info);

        // Update state
        env.storage().instance().set(&DataKey::Campaigns, &campaigns);
        env.storage().instance().set(&DataKey::NextId, &(next_id + 1));

        // Emit registration event
        env.events().publish(
            (symbol_short!("register"), creator),
            (next_id, escrow_address.clone()),
        );

        env.storage().instance().extend_ttl(5000, 10000);

        escrow_address
    }

    /// Read all campaigns registered on-chain.
    pub fn get_campaigns(env: Env) -> Vec<CampaignInfo> {
        env.storage().instance().get(&DataKey::Campaigns).unwrap_or(Vec::new(&env))
    }

    /// Fetch a single campaign by ID.
    pub fn get_campaign_by_id(env: Env, id: u32) -> Option<CampaignInfo> {
        let campaigns: Vec<CampaignInfo> = env.storage().instance().get(&DataKey::Campaigns).unwrap_or(Vec::new(&env));
        for camp in campaigns.iter() {
            if camp.id == id {
                return Some(camp);
            }
        }
        None
    }
}

#[cfg(test)]
mod test;
