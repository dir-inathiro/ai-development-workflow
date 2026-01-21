'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategorySummary } from '@/app/types/household';
import { formatCurrency } from '@/app/utils/householdCalculations';

interface BreakdownTabProps {
  incomeSummary: CategorySummary[];
  expenseSummary: CategorySummary[];
}

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

export function BreakdownTab({
  incomeSummary,
  expenseSummary,
}: BreakdownTabProps) {
  const renderCategoryTable = (
    summary: CategorySummary[],
    type: 'income' | 'expense'
  ) => {
    if (summary.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
          データがありません
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                カテゴリ
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                金額
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                割合
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, index) => (
              <tr
                key={item.category}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-slate-900">
                      {item.category}
                    </span>
                  </div>
                </td>
                <td
                  className={`text-right py-3 px-4 font-semibold ${
                    type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(item.amount)}
                </td>
                <td className="text-right py-3 px-4 text-slate-600">
                  {item.percentage.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPieChart = (summary: CategorySummary[]) => {
    if (summary.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-slate-500">
          データがありません
        </div>
      );
    }

    const data = summary.map((item) => ({
      name: item.category,
      value: item.amount,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '0.5rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-8">
      {/* Expense Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">支出の内訳</h3>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">{renderPieChart(expenseSummary)}</div>
          {renderCategoryTable(expenseSummary, 'expense')}
        </div>
      </div>

      {/* Income Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">収入の内訳</h3>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">{renderPieChart(incomeSummary)}</div>
          {renderCategoryTable(incomeSummary, 'income')}
        </div>
      </div>
    </div>
  );
}
