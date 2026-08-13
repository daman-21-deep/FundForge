export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  category: string;
  targetAmount: number; // in XLM
  currentAmount: number; // in XLM
  daysLeft: number;
  durationDays: number;
  status: 'active' | 'draft' | 'completed';
  image: string;
  backersCount: number;
  contractAddress?: string;
}

export interface Transaction {
  hash: string;
  method: string;
  status: 'Success' | 'Pending' | 'Failed';
  amount: number; // in XLM
  timestamp: string;
  sender: string;
}

export interface ContractEvent {
  id: string;
  type: string;
  data: string;
  timestamp: string;
}

export type WalletType = 'freighter' | 'albedo' | null;

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string | null;
  balance: string;
  walletType: WalletType;
}
