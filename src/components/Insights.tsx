import React from 'react';
import { useApp } from '../contexts/AppContext';

const Insights: React.FC = () => {
  const { state } = useApp();

  // Calculate insights
  const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const netIncome = totalIncome - totalExpenses;

  const categoryExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const highestSpendingCategory = Object.entries(categoryExpenses).reduce((a, b) => categoryExpenses[a[0]] > categoryExpenses[b[0]] ? a : b, ['None', 0]);

  const monthlyData = state.transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
    if (t.type === 'income') acc[month].income += t.amount;
    else acc[month].expenses += Math.abs(t.amount);
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const monthlyComparison = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    net: data.income - data.expenses
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-300/20 hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Financial Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Income:</span>
              <span className="font-bold text-green-600">₹{totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Expenses:</span>
              <span className="font-bold text-red-600">₹{totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 dark:text-gray-400">Net Income:</span>
              <span className={`font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{netIncome.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Highest Spending Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-300/20 hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Spending Category</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{highestSpendingCategory[0]}</p>
            <p className="text-gray-600 dark:text-gray-400">₹{highestSpendingCategory[1].toLocaleString()} spent</p>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-300/20 hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Performance</h3>
          <div className="space-y-2">
            {monthlyComparison.slice(-3).map(({ month, net }) => (
              <div key={month} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{month}:</span>
                <span className={`font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{net.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition duration-300">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Spending by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(categoryExpenses)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount]) => (
            <div key={category} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-300/20">
              <p className="font-medium text-gray-900 dark:text-white">{category}</p>
              <p className="text-lg font-bold text-red-600">₹{amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition duration-300">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recommendations</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          {highestSpendingCategory[0] !== 'None' && (
            <li>• Consider reducing expenses in {highestSpendingCategory[0]} to improve savings.</li>
          )}
          {netIncome < 0 && (
            <li>• Your expenses exceed income. Review your budget to avoid debt.</li>
          )}
          {totalExpenses > totalIncome * 0.8 && (
            <li>• Expenses are high relative to income. Aim to keep expenses below 80% of income.</li>
          )}
          {Object.keys(categoryExpenses).length > 5 && (
            <li>• You have diverse spending categories. Consider consolidating for better tracking.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Insights;