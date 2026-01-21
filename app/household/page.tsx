'use client';

import { useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ChevronLeft, ChevronRight, LayoutGrid, History, PieChart } from 'lucide-react';
import { useHouseholdData } from '@/app/hooks/useHouseholdData';
import { OverviewTab } from '@/app/components/OverviewTab';
import { HistoryTab } from '@/app/components/HistoryTab';
import { BreakdownTab } from '@/app/components/BreakdownTab';
import {
  filterTransactionsByMonth,
  calculateMonthlySummary,
  calculateCategorySummary,
} from '@/app/utils/householdCalculations';

export default function HouseholdPage() {
  const {
    transactions,
    assets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useHouseholdData();

  const currentYear = 2026;
  const currentMonth = 1;

  const monthlyTransactions = useMemo(
    () => filterTransactionsByMonth(transactions, currentYear, currentMonth),
    [transactions, currentYear, currentMonth]
  );

  const monthlySummary = useMemo(
    () => calculateMonthlySummary(monthlyTransactions),
    [monthlyTransactions]
  );

  const incomeSummary = useMemo(
    () => calculateCategorySummary(monthlyTransactions, 'income'),
    [monthlyTransactions]
  );

  const expenseSummary = useMemo(
    () => calculateCategorySummary(monthlyTransactions, 'expense'),
    [monthlyTransactions]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <main className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">家計簿</h1>

          {/* Month Selector */}
          <div className="flex items-center justify-center gap-4">
            <button
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="前の月"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="text-xl font-semibold text-slate-900">
              {currentYear}年{currentMonth}月
            </div>
            <button
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="次の月"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root defaultValue="overview" className="w-full">
          <Tabs.List className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-lg">
            <Tabs.Trigger
              value="overview"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-700 font-medium transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white hover:bg-slate-100 data-[state=active]:hover:bg-slate-900"
            >
              <LayoutGrid className="w-5 h-5" />
              <span>概要</span>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="history"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-700 font-medium transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white hover:bg-slate-100 data-[state=active]:hover:bg-slate-900"
            >
              <History className="w-5 h-5" />
              <span>履歴</span>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="breakdown"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-700 font-medium transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white hover:bg-slate-100 data-[state=active]:hover:bg-slate-900"
            >
              <PieChart className="w-5 h-5" />
              <span>内訳</span>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview">
            <OverviewTab
              assets={assets}
              monthlySummary={monthlySummary}
              onAddTransaction={addTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="history">
            <HistoryTab
              transactions={monthlyTransactions}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="breakdown">
            <BreakdownTab
              incomeSummary={incomeSummary}
              expenseSummary={expenseSummary}
            />
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
}
