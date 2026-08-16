import { ObservabilityLogger } from './logger';

export interface MonitoringIssue {
  id: string;
  type: 'ERROR' | 'CONTRACT' | 'TRANSACTION' | 'WALLET' | 'RPC' | 'PERFORMANCE';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private static issues: MonitoringIssue[] = [];

  private static logIssue(type: MonitoringIssue['type'], message: string, metadata?: Record<string, any>) {
    const issue: MonitoringIssue = {
      id: `issue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.issues.unshift(issue);
    if (this.issues.length > 50) {
      this.issues.pop();
    }

    // Log to internal logger
    if (type === 'ERROR' || type === 'CONTRACT' || type === 'TRANSACTION' || type === 'RPC') {
      ObservabilityLogger.error(`[Monitoring - ${type}] ${message}`, new Error(message), metadata);
    } else if (type === 'WALLET') {
      ObservabilityLogger.warn(`[Monitoring - ${type}] ${message}`, metadata);
    } else {
      ObservabilityLogger.info(`[Monitoring - ${type}] ${message}`, metadata);
    }

    // Sentry Integration hook
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      try {
        (window as any).Sentry.withScope((scope: any) => {
          scope.setExtra('metadata', metadata);
          scope.setTag('issue_type', type);
          (window as any).Sentry.captureMessage(`[${type}] ${message}`);
        });
      } catch (err) {
        console.error('Failed to send to Sentry:', err);
      }
    }

    // Persist issues locally
    try {
      localStorage.setItem('fundforge_monitoring_issues', JSON.stringify(this.issues));
    } catch (e) {
      console.warn('Failed to save monitoring issues to localStorage:', e);
    }
  }

  static getIssues(): MonitoringIssue[] {
    if (this.issues.length === 0) {
      try {
        const stored = localStorage.getItem('fundforge_monitoring_issues');
        if (stored) {
          this.issues = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to parse stored monitoring issues:', e);
      }
    }
    return this.issues;
  }

  // 1. Frontend errors
  static trackFrontendError(error: Error, componentStack?: string) {
    this.logIssue('ERROR', error.message, {
      stack: error.stack,
      componentStack,
    });
  }

  // 2. Contract interaction failures
  static trackContractFailure(method: string, error: string, args?: Record<string, any>) {
    this.logIssue('CONTRACT', `Contract method '${method}' failed: ${error}`, {
      method,
      args,
    });
  }

  // 3. Failed transactions
  static trackFailedTransaction(txType: string, error: string, hash?: string) {
    this.logIssue('TRANSACTION', `Transaction failed during ${txType}: ${error}`, {
      transaction_type: txType,
      hash,
    });
  }

  // 4. Wallet failures
  static trackWalletFailure(walletType: string, action: string, error: string) {
    this.logIssue('WALLET', `Wallet '${walletType}' error during ${action}: ${error}`, {
      walletType,
      action,
    });
  }

  // 5. RPC failures
  static trackRpcFailure(url: string, method: string, error: string) {
    this.logIssue('RPC', `RPC request failed for ${url} (method: ${method}): ${error}`, {
      url,
      method,
    });
  }

  // 6. Performance metrics
  static trackPerformanceMetric(metricName: string, durationMs: number, metadata?: Record<string, any>) {
    this.logIssue('PERFORMANCE', `Performance metric '${metricName}': ${durationMs}ms`, {
      metricName,
      durationMs,
      ...metadata,
    });
  }
}

export default MonitoringService;
export { MonitoringService };
