import type {
  Transaction,
  MonthlySummary,
  CategorySummary,
  Asset,
} from '@/app/types/household';

export function filterTransactionsByMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  return transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function calculateMonthlySummary(
  transactions: Transaction[]
): MonthlySummary {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function calculateCategorySummary(
  transactions: Transaction[],
  type: 'income' | 'expense'
): CategorySummary[] {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<string, number>();

  filtered.forEach((t) => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  });

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category: category as CategorySummary['category'],
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function calculateTotalAssets(assets: Asset): number {
  return assets.cash + assets.bank;
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
