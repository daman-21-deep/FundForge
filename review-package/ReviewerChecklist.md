# Stellar Level 4 MVP Reviewer Checklist

Use this step-by-step checklist to verify FundForge's Level 4 compliance in under 5 minutes.

- [ ] **Onboarding Experience**
  * Open the app. The multi-step welcome tour modal should display automatically if you haven't completed it.
  * Go through Steps 1 to 4 to review how wallet connection, campaign exploration, creation, and funding work.

- [ ] **Wallet Connection**
  * Click the **Connect Wallet** button in the Navbar or inside the onboarding modal.
  * Select your preferred wallet (Freighter/Albedo) to connect on the Stellar Testnet.
  * The wallet state, including your public key and current XLM balance, should display in the Navbar.

- [ ] **Explore Campaigns**
  * Navigate to the **Explore** tab to browse active, draft, and completed campaigns.
  * Check responsiveness by resizing the browser window to mobile size.

- [ ] **On-Chain Donation**
  * Open an active campaign (e.g. AeroGarden X-1).
  * Click **Back Campaign**, enter an amount, and submit.
  * Sign the transaction through your connected wallet. The transaction history log will display the new tx hash with a link to Stellar.expert.

- [ ] **On-Chain Campaign Creation**
  * Navigate to the **Create** page.
  * Fill out the form (Title, Description, Category, Target Amount, Duration).
  * Click **Launch Campaign** and sign the transaction. The campaign should be registered on-chain and appear on the Explore page.

- [ ] **Feedback System**
  * Navigate to the **Feedback** tab.
  * Check the configured Google Form and Sheet links.
  * Submit a local rating/feedback item using the form. It will instantly update the local stats.

- [ ] **Admin Dashboard & Evidence**
  * Navigate to the **Admin** tab.
  * Review the real-time analytics graphs (Donation volume, Conversion funnel).
  * Drag and drop / import a CSV or JSON file in the uploader. The dashboard stats (Unique wallets, contributors, total volume) will instantly update.
