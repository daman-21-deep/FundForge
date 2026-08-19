# Health & Error Monitoring Report

FundForge relies on a robust observability engine to track platform stability and record errors occurring during live interactions.

## Centralized Monitoring Service: `src/services/monitoring.ts`
All critical exceptions, performance limits, and system failures are compiled and sent to:
1. **Sentry SDK** (via `window.Sentry` integration)
2. **ObservabilityLogger** (detailed error logs with stack traces)
3. **Local Monitoring Log** (persisted for admin inspection)

---

## Error Classification & Handling

The following failure categories are captured:

### 1. Frontend Runtime Errors (`trackFrontendError`)
* **Trigger**: Unhandled React component crashes.
* **Resolution**: Caught by the global `ErrorBoundary` component, displaying a fallback UI and prompting the user to reload.
* **Telemetry**: Logs component stack context and raw exception data.

### 2. Contract Call Failures (`trackContractFailure`)
* **Trigger**: RPC simulation failures or transaction validation errors.
* **Resolution**: Alerts the user on-screen and switches to sandbox simulation mode if appropriate.

### 3. Transaction Failures (`trackFailedTransaction`)
* **Trigger**: Ledger submissions rejected due to insufficient fees, timeouts, or invalid signatures.
* **Resolution**: Details are shown to the user with a direct explorer link to check the transaction state.

### 4. Wallet Connection Failures (`trackWalletFailure`)
* **Trigger**: Connection rejections, missing extensions, or incorrect network configs.
* **Resolution**: Prompts the user with explicit instructions to install the browser extension or change the wallet network to Testnet.

### 5. RPC & Node Outages (`trackRpcFailure`)
* **Trigger**: Testnet Horizon nodes failing to respond.
* **Resolution**: Gracefully warns the user that the Stellar testnet is experiencing high latency and offers to retry.
