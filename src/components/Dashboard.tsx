import React from 'react';
import { useApp } from '../contexts/AppContext';
import SummaryCard from './SummaryCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { state } = useApp();

  // Calculate summary statistics
  const totalBalance = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  // Prepare balance over time chart data
  const balanceData = state.transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, t) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      acc.push({
        date: t.date,
        balance: lastBalance + t.amount
      });
      return acc;
    }, [] as { date: string; balance: number }[]);

  // Prepare spending by category chart data
  const categoryData = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" value={totalBalance} icon="💰" />
        <SummaryCard title="Total Income" value={totalIncome} icon="📈" />
        <SummaryCard title="Total Expenses" value={totalExpenses} icon="📉" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Balance Over Time */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">📊</span>
            Balance Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Balance']} />
              <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">🥧</span>
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">💡</span>
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Highest Spending Category</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {Object.entries(categoryData).reduce((a, b) => categoryData[a[0]] > categoryData[b[0]] ? a : b, ['None', 0])[0]}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Average Monthly Expense</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{Math.round(totalExpenses / 3).toLocaleString()} {/* Assuming 3 months of data */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;