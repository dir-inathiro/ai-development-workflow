'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';
import type { Transaction, Asset, MonthlySummary } from '@/app/types/household';
import { formatCurrency } from '@/app/utils/householdCalculations';

interface OverviewTabProps {
  assets: Asset;
  monthlySummary: MonthlySummary;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function OverviewTab({
  assets,
  monthlySummary,
  onAddTransaction,
}: OverviewTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
    category: '食費' as Transaction['category'],
    amount: '',
    description: '',
  });

  const totalAssets = assets.cash + assets.bank;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount) {
      onAddTransaction({
        date: formData.date,
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
      });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: '食費',
        amount: '',
        description: '',
      });
      setIsDialogOpen(false);
    }
  };

  const incomeCategories = ['給与', 'ボーナス', 'その他'];
  const expenseCategories = ['医療費', '光熱費', '食費', '交通費', '娯楽費', 'その他'];

  return (
    <div className="space-y-6">
      {/* Assets Card */}
      <div className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold">総資産</h2>
        </div>
        <div className="text-4xl font-bold mb-6">
          {totalAssets >= 0 ? '' : '-'}
          {formatCurrency(Math.abs(totalAssets))}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">現金</span>
            <span className="font-medium">
              {assets.cash >= 0 ? '' : '-'}
              {formatCurrency(Math.abs(assets.cash))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">銀行口座</span>
            <span className="font-medium">
              {formatCurrency(assets.bank)}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          2026年1月の収支
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-green-600 mb-3">
              <svg
                className="w-5 h-5"
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
              <span className="text-sm font-medium">収入</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(monthlySummary.income)}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-red-600 mb-3">
              <svg
                className="w-5 h-5"
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
              <span className="text-sm font-medium">支出</span>
            </div>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(monthlySummary.expense)}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">収支</span>
            </div>
            <div
              className={`text-3xl font-bold ${
                monthlySummary.balance >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}
            >
              {monthlySummary.balance >= 0 ? '' : '-'}
              {formatCurrency(Math.abs(monthlySummary.balance))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="w-full md:w-auto mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-medium shadow-lg">
            <Plus className="w-5 h-5" />
            取引を追加
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold text-slate-900 mb-6">
              取引を追加
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  日付
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  種類
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: 'income',
                        category: '給与',
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      formData.type === 'income'
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-slate-100 text-slate-700 border-2 border-transparent'
                    }`}
                  >
                    収入
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: 'expense',
                        category: '食費',
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      formData.type === 'expense'
                        ? 'bg-red-100 text-red-700 border-2 border-red-500'
                        : 'bg-slate-100 text-slate-700 border-2 border-transparent'
                    }`}
                  >
                    支出
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  カテゴリ
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Transaction['category'],
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {(formData.type === 'income'
                    ? incomeCategories
                    : expenseCategories
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  金額
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0"
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="メモを入力"
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
                  追加
                </button>
              </div>
            </form>

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
