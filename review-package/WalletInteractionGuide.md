# Wallet Interaction & Transaction Guide

This guide details how reviewers and users can interact with the Stellar testnet using FundForge.

## 1. Supported Wallets
* **Freighter**: The official browser extension wallet developed by SDF.
* **Albedo**: A web-based wallet service that runs on any browser.

---

## 2. Testnet Account Funding
Before submitting transactions:
1. Copy your public key from Freighter/Albedo.
2. Go to [Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet) on the Stellar Laboratory.
3. Paste your public key and click **Get Funds** to receive 10,000 testnet XLM.

---

## 3. On-Chain Transaction Verification
All major actions on FundForge trigger real transactions on the Stellar Testnet:

### Campaign Creation
* **Operation**: Payment operation (circular self-payment to demonstrate signature).
* **Memo**: `Create:<Campaign Name>` (limited to 19 characters due to Stellar Text Memo size).
* **Explorer Link**: Verify on [Stellar.expert Testnet Explorer](https://stellar.expert/explorer/testnet).

### Donation/Funding
* **Operation**: Direct payment to the campaign creator's address.
* **Memo**: `Forge:<Campaign Name>` (denotes contribution to the specific campaign).
* **Explorer Link**: Verify on [Stellar.expert Testnet Explorer](https://stellar.expert/explorer/testnet).

---

## 4. Wallet Telemetry
When transactions are signed or connection errors occur, the transaction state is logged inside the **Admin Dashboard** (`/admin`) and the telemetry logs.
