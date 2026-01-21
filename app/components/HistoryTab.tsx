'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, Trash2, X } from 'lucide-react';
import type { Transaction } from '@/app/types/household';
import { formatCurrency, formatDate } from '@/app/utils/householdCalculations';

interface HistoryTabProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function HistoryTab({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
}: HistoryTabProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingTransaction) {
      const formData = new FormData(e.currentTarget);
      onUpdateTransaction(editingTransaction.id, {
        date: formData.get('date') as string,
        type: formData.get('type') as 'income' | 'expense',
        category: formData.get('category') as Transaction['category'],
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
      });
      setIsDialogOpen(false);
      setEditingTransaction(null);
    }
  };

  const getTypeIcon = (type: 'income' | 'expense') => {
    if (type === 'income') {
      return (
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      </div>
    );
  };

  const incomeCategories = ['給与', 'ボーナス', 'その他'];
  const expenseCategories = ['医療費', '光熱費', '食費', '交通費', '娯楽費', 'その他'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        2026年1月の取引履歴
      </h3>

      {sortedTransactions.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          取引履歴がありません
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4">
                {getTypeIcon(transaction.type)}

                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-lg">
                    {transaction.category}
                  </div>
                  <div className="text-sm text-slate-500">
                    {formatDate(transaction.date)}
                  </div>
                  {transaction.description && (
                    <div className="text-sm text-slate-600 mt-1">
                      {transaction.description}
                    </div>
                  )}
                </div>

                <div
                  className={`text-2xl font-bold ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="編集"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="削除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold text-slate-900 mb-6">
              取引を編集
            </Dialog.Title>

            {editingTransaction && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    日付
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingTransaction.date}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    種類
                  </label>
                  <select
                    name="type"
                    defaultValue={editingTransaction.type}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="income">収入</option>
                    <option value="expense">支出</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    カテゴリ
                  </label>
                  <select
                    name="category"
                    defaultValue={editingTransaction.category}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <optgroup label="収入">
                      {incomeCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="支出">
                      {expenseCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    金額
                  </label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingTransaction.amount}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    メモ（任意）
                  </label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingTransaction.description}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition-colors font-medium"
                    >
                      キャンセル
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    更新
                  </button>
                </div>
              </form>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="閉じる"
              >
                <X className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
