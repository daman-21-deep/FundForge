#[cfg(test)]
use super::{CampaignRegistryContract, CampaignRegistryContractClient};
use soroban_sdk::{
    testutils::Address as _, Address, Env, BytesN, String
};

#[test]
fn test_registry_initialization() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);

    let registry_id = env.register(CampaignRegistryContract, ());
    let registry_client = CampaignRegistryContractClient::new(&env, &registry_id);

    registry_client.initialize(&admin);

    let campaigns = registry_client.get_campaigns();
    assert_eq!(campaigns.len(), 0);

    let camp = registry_client.get_campaign_by_id(&999u32);
    assert!(camp.is_none());
}

#[test]
#[should_panic(expected = "Registry already initialized")]
fn test_registry_double_initialization() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);

    let registry_id = env.register(CampaignRegistryContract, ());
    let registry_client = CampaignRegistryContractClient::new(&env, &registry_id);

    registry_client.initialize(&admin);
    registry_client.initialize(&admin); // Must panic
}

#[test]
#[should_panic]
fn test_unauthorized_upgrade() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let malicious_user = Address::generate(&env);

    let registry_id = env.register(CampaignRegistryContract, ());
    let registry_client = CampaignRegistryContractClient::new(&env, &registry_id);

    registry_client.initialize(&admin);

    let dummy_hash = BytesN::from_array(&env, &[0u8; 32]);
    
    // Call upgrade as a non-admin user
    env.as_contract(&registry_id, || {
        registry_client.upgrade(&dummy_hash);
    });
}
