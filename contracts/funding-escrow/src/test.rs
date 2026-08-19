#[cfg(test)]
use super::{FundingEscrowContract, FundingEscrowContractClient};
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, BytesN, Env,
};

fn create_token_contract<'a>(
    env: &Env,
    admin: &Address,
) -> (token::Client<'a>, token::StellarAssetClient<'a>) {
    let token_address = env.register_stellar_asset_contract(admin.clone());
    (
        token::Client::new(env, &token_address),
        token::StellarAssetClient::new(env, &token_address),
    )
}

#[test]
fn test_escrow_funding_success() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);
    let contributor = Address::generate(&env);

    let (token_client, token_admin) = create_token_contract(&env, &admin);
    let escrow_id = env.register(FundingEscrowContract, ());
    let escrow_client = FundingEscrowContractClient::new(&env, &escrow_id);

    let goal = 1000i128;
    let deadline = env.ledger().timestamp() + 1000;
    escrow_client.initialize(&token_client.address, &creator, &goal, &deadline);

    token_admin.mint(&contributor, &2000i128);

    escrow_client.fund(&contributor, &600i128);
    escrow_client.fund(&contributor, &400i128);

    let metadata = escrow_client.get_metadata();
    assert_eq!(metadata.total_raised, 1000);
    assert_eq!(escrow_client.get_contribution(&contributor), 1000);
    assert_eq!(token_client.balance(&escrow_id), 1000);

    env.ledger().set_timestamp(deadline + 10);
    escrow_client.claim_funds();

    assert_eq!(token_client.balance(&creator), 1000);
    assert_eq!(token_client.balance(&escrow_id), 0);
    assert!(escrow_client.get_metadata().withdrawn);
}

#[test]
fn test_cancel_campaign_and_refund() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);
    let contributor = Address::generate(&env);

    let (token_client, token_admin) = create_token_contract(&env, &admin);
    let escrow_id = env.register(FundingEscrowContract, ());
    let escrow_client = FundingEscrowContractClient::new(&env, &escrow_id);

    let deadline = env.ledger().timestamp() + 1000;
    escrow_client.initialize(&token_client.address, &creator, &1000i128, &deadline);

    token_admin.mint(&contributor, &1000i128);
    escrow_client.fund(&contributor, &500i128);

    assert_eq!(escrow_client.get_state(), super::EscrowState::Active);

    // Creator cancels campaign before deadline
    escrow_client.cancel_campaign();
    assert_eq!(escrow_client.get_state(), super::EscrowState::Cancelled);

    // Contributor gets immediate refund even before deadline
    escrow_client.claim_refund(&contributor);
    assert_eq!(token_client.balance(&contributor), 1000);
}

#[test]
#[should_panic]
fn test_claim_funds_fails_if_goal_not_reached() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);
    let contributor = Address::generate(&env);

    let (token_client, token_admin) = create_token_contract(&env, &admin);
    let escrow_id = env.register(FundingEscrowContract, ());
    let escrow_client = FundingEscrowContractClient::new(&env, &escrow_id);

    let deadline = env.ledger().timestamp() + 1000;
    escrow_client.initialize(&token_client.address, &creator, &1000i128, &deadline);

    token_admin.mint(&contributor, &1000i128);
    escrow_client.fund(&contributor, &500i128);

    env.ledger().set_timestamp(deadline + 10);
    escrow_client.claim_funds();
}

#[test]
fn test_refund_on_campaign_failure() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);
    let contributor = Address::generate(&env);

    let (token_client, token_admin) = create_token_contract(&env, &admin);
    let escrow_id = env.register(FundingEscrowContract, ());
    let escrow_client = FundingEscrowContractClient::new(&env, &escrow_id);

    let deadline = env.ledger().timestamp() + 1000;
    escrow_client.initialize(&token_client.address, &creator, &1000i128, &deadline);

    token_admin.mint(&contributor, &1000i128);
    escrow_client.fund(&contributor, &500i128);

    assert_eq!(token_client.balance(&contributor), 500);

    env.ledger().set_timestamp(deadline + 10);
    assert_eq!(escrow_client.get_state(), super::EscrowState::Failed);
    escrow_client.claim_refund(&contributor);

    assert_eq!(token_client.balance(&contributor), 1000);
    assert_eq!(escrow_client.get_contribution(&contributor), 0);
}

#[test]
#[should_panic]
fn test_escrow_double_initialization() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);

    let (token_client, _) = create_token_contract(&env, &admin);
    let escrow_id = env.register(FundingEscrowContract, ());
    let escrow_client = FundingEscrowContractClient::new(&env, &escrow_id);

    let deadline = env.ledger().timestamp() + 1000;
    escrow_client.initialize(&token_client.address, &creator, &1000i128, &deadline);
    escrow_client.initialize(&token_client.address, &creator, &1000i128, &deadline);
}

#[test]
#[should_panic]
fn test_unauthorized_escrow_upgrade() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);

    let (token_client, _) = create_token_contract(&env, &admin);
    let escrow_id = env.register(FundingEscrowContract, ());
    let escrow_client = FundingEscrowContractClient::new(&env, &escrow_id);

    let deadline = env.ledger().timestamp() + 1000;
    escrow_client.initialize(&token_client.address, &creator, &1000i128, &deadline);

    let dummy_hash = BytesN::from_array(&env, &[1u8; 32]);

    env.as_contract(&escrow_id, || {
        escrow_client.upgrade(&dummy_hash);
    });
}
