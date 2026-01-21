import { useState, useEffect } from 'react';
import type { Transaction, Asset } from '@/app/types/household';

const STORAGE_KEY_TRANSACTIONS = 'household_transactions';
const STORAGE_KEY_ASSETS = 'household_assets';

export function useHouseholdData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset>({ cash: 0, bank: 0 });

  useEffect(() => {
    const storedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    const storedAssets = localStorage.getItem(STORAGE_KEY_ASSETS);

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
  }, [assets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const updateAssets = (newAssets: Partial<Asset>) => {
    setAssets({ ...assets, ...newAssets });
  };

  return {
    transactions,
    assets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateAssets,
  };
}
