import { ObservabilityLogger } from './logger';

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp: string;
}

class AnalyticsService {
  private static events: AnalyticsEvent[] = [];

  private static logEvent(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };
    
    // Maintain a local log of events for the Admin Analytics Dashboard
    this.events.unshift(event);
    if (this.events.length > 100) {
      this.events.pop();
    }

    // Log to internal logger
    ObservabilityLogger.info(`[Analytics] Event tracked: ${eventName}`, properties);

    // Track to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', eventName, properties);
      } catch (err) {
        console.error('Failed to send to Google Analytics:', err);
      }
    }

    // Track to Plausible if available
    if (typeof window !== 'undefined' && (window as any).plausible) {
      try {
        (window as any).plausible(eventName, { props: properties });
      } catch (err) {
        console.error('Failed to send to Plausible:', err);
      }
    }

    // Persist local history
    try {
      localStorage.setItem('fundforge_analytics_events', JSON.stringify(this.events));
    } catch (e) {
      console.warn('Failed to save analytics events to localStorage:', e);
    }
  }

  static getEvents(): AnalyticsEvent[] {
    if (this.events.length === 0) {
      try {
        const stored = localStorage.getItem('fundforge_analytics_events');
        if (stored) {
          this.events = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to parse stored analytics events:', e);
      }
    }
    return this.events;
  }

  // 1. Wallet connections
  static trackWalletConnected(walletType: string, address: string) {
    this.logEvent('wallet_connect', {
      wallet_type: walletType,
      wallet_address_short: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
    });
  }

  // 2. Campaign creation
  static trackCampaignCreated(campaignId: string, title: string, targetAmount: number, category: string) {
    this.logEvent('campaign_create', {
      campaign_id: campaignId,
      campaign_title: title,
      target_amount: targetAmount,
      category,
    });
  }

  // 3. Campaign views
  static trackCampaignViewed(campaignId: string, title: string) {
    this.logEvent('campaign_view', {
      campaign_id: campaignId,
      campaign_title: title,
    });
  }

  // 4. Donations
  static trackDonationSubmitted(campaignId: string, title: string, amount: number, walletAddress: string) {
    this.logEvent('donation_submit', {
      campaign_id: campaignId,
      campaign_title: title,
      amount,
      wallet_address_short: `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`,
    });
  }

  // 5. Successful transactions
  static trackTransactionSuccess(txType: string, hash: string, properties?: Record<string, any>) {
    this.logEvent('transaction_success', {
      transaction_type: txType,
      transaction_hash: hash,
      ...properties,
    });
  }

  // 6. Failed transactions
  static trackTransactionFailure(txType: string, error: string, properties?: Record<string, any>) {
    this.logEvent('transaction_failure', {
      transaction_type: txType,
      error_message: error,
      ...properties,
    });
  }

  // 7. Page visits
  static trackPageView(pageName: string, path: string) {
    this.logEvent('page_view', {
      page_name: pageName,
      path,
    });
  }

  // 8. User onboarding completion
  static trackOnboardingCompleted() {
    this.logEvent('onboarding_completed', {
      completed_at: new Date().toISOString(),
    });
  }
}

export default AnalyticsService;
export { AnalyticsService };
