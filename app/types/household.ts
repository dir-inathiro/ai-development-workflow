export type TransactionType = 'income' | 'expense';

export type CategoryType =
  | '給与'
  | 'ボーナス'
  | '医療費'
  | '光熱費'
  | '食費'
  | '交通費'
  | '娯楽費'
  | 'その他';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: CategoryType;
  amount: number;
  description?: string;
}

export interface Asset {
  cash: number;
  bank: number;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  category: CategoryType;
  amount: number;
  percentage: number;
}
