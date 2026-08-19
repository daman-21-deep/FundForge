# Analytics Integration Report

FundForge features a production-ready telemetry framework designed to track engagement and verify user adoption without fabricating data.

## Telemetry Service: `src/services/analytics.ts`
Our centralized `AnalyticsService` logs events to:
1. **Google Analytics** (via `window.gtag` if initialized)
2. **Plausible Analytics** (via `window.plausible` custom event hooks)
3. **ObservabilityLogger** (stdout JSON logger)
4. **Local Dashboard State** (persisted locally for real-time review)

---

## Tracked Events & Mappings

The following table documents the telemetry event catalog:

| Trigger Action | Event Name | Properties Tracked | Code Hook |
| :--- | :--- | :--- | :--- |
| **Wallet Connected** | `wallet_connect` | `wallet_type`, `wallet_address_short` | `WalletContext.tsx:L93` |
| **Campaign Created** | `campaign_create` | `campaign_id`, `campaign_title`, `target_amount`, `category` | `CreateCampaignPage.tsx` |
| **Campaign Viewed** | `campaign_view` | `campaign_id`, `campaign_title` | `CampaignDetailsPage.tsx` |
| **Donation Initiated** | `donation_submit` | `campaign_id`, `campaign_title`, `amount`, `wallet_address_short` | `DonationModal.tsx` |
| **Transaction Success** | `transaction_success` | `transaction_type`, `transaction_hash`, `metadata` | `contract.ts:L104, L209` |
| **Transaction Failure** | `transaction_failure` | `transaction_type`, `error_message`, `metadata` | `contract.ts:L119, L224` |
| **Page Visit** | `page_view` | `page_name`, `path` | `App.tsx:L24` |
| **Onboarding Complete**| `onboarding_completed`| `completed_at` | `OnboardingFlow.tsx:L43` |

---

## Live Monitoring Verification
Reviewers can view the live telemetry feed directly on the **Admin Dashboard** (`/admin`), which lists events dynamically as you browse and interact with the application.
