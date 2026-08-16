import { create } from 'zustand';

export interface TxRecord {
  id: string;
  title: string;
  hash: string | null;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  timestamp: string;
  error?: string;
  explorerLink?: string;
}

interface TransactionStore {
  transactions: TxRecord[];
  addTransaction: (title: string) => TxRecord;
  updateTransaction: (id: string, updates: Partial<TxRecord>) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  
  addTransaction: (title) => {
    const newTx: TxRecord = {
      id: `tx_${Date.now()}`,
      title,
      hash: null,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      transactions: [newTx, ...state.transactions].slice(0, 50), // Limit to last 50 transactions
    }));
    return newTx;
  },

  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    }));
  },

  clearTransactions: () => set({ transactions: [] }),
}));
