import { getHorizonServer } from './stellar';
import { ContractService } from './contract';
import type { ContractEvent } from '../types';

type EventCallback = (event: ContractEvent) => void;

class EventStreamService {
  private static listeners: Set<EventCallback> = new Set();
  private static closeStream: (() => void) | null = null;

  /**
   * Initialize a live Server-Sent Events (SSE) stream from the Stellar Horizon Testnet.
   * Streams transactions dynamically, parsing payments or contract execution metadata in real-time.
   */
  static startStreaming(creatorAddress: string) {
    if (this.closeStream) {
      this.closeStream();
    }

    try {
      const server = getHorizonServer('TESTNET');
      
      // Stream operations in real-time using EventSource (SSE)
      const streamInstance = server.operations()
        .forAccount(creatorAddress)
        .cursor('now')
        .stream({
          onmessage: (op: any) => {
            console.log('Horizon Stream received operation:', op);
            
            // Map payment operations to campaign contribution updates
            if (op.type === 'payment' && op.asset_type === 'native') {
              const amount = parseFloat(op.amount);
              const sender = op.from;
              
              const newEvent = ContractService.addEvent(
                'ContributionReceived',
                `${amount} XLM contributed by ${sender.substring(0, 4)}...${sender.substring(sender.length - 4)}`
              );
              
              // Notify listeners
              this.notifyListeners(newEvent);
            }
          },
          onerror: (err) => {
            console.error('Horizon SSE Stream encountered error:', err);
          }
        });

      this.closeStream = () => {
        if (typeof streamInstance === 'function') {
          streamInstance();
        } else if (streamInstance && typeof (streamInstance as any).close === 'function') {
          (streamInstance as any).close();
        }
        this.closeStream = null;
      };
    } catch (err) {
      console.error('Failed to initialize Horizon event streaming:', err);
    }
  }

  /**
   * Subscribe to all contract/activity events
   */
  static subscribeToContractEvents(callback: EventCallback): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Subscribe to campaign-specific creations
   */
  static subscribeToCampaignEvents(callback: EventCallback): () => void {
    return this.subscribeToContractEvents((evt) => {
      if (evt.type === 'CampaignCreated') {
        callback(evt);
      }
    });
  }

  /**
   * Subscribe to donations/backing events
   */
  static subscribeToDonationEvents(callback: EventCallback): () => void {
    return this.subscribeToContractEvents((evt) => {
      if (evt.type === 'ContributionReceived') {
        callback(evt);
      }
    });
  }

  /**
   * Internal dispatcher to propagate new events to all active listeners
   */
  private static notifyListeners(event: ContractEvent) {
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error notifying event listener:', err);
      }
    });
  }

  /**
   * Clean up open network streams
   */
  static stopStreaming() {
    if (this.closeStream) {
      this.closeStream();
    }
  }
}

export default EventStreamService;
export { EventStreamService };
