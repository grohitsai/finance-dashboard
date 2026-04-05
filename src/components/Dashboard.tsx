import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import SummaryCard from './SummaryCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface PieEntry {
  name: string;
  value: number;
}

interface MemoPieChartProps {
  data: PieEntry[];
  labelData: string[];
}

const MemoPieChart = React.memo(({ data, labelData }: MemoPieChartProps) => {
  const renderLabel = useCallback(
    ({ index }: { index: number }) => labelData[index] ?? '',
    [labelData]
  );

  return (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={false}
        animationDuration={400}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}, (prev, next) => prev.data === next.data && prev.labelData === next.labelData);

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const [lineHoverActive, setLineHoverActive] = useState(false);
  const [lineAnimationKey, setLineAnimationKey] = useState(0);

  const handleLineContainerEnter = () => {
    if (!lineHoverActive) {
      setLineHoverActive(true);
      setLineAnimationKey(prev => prev + 1);
    }
  };

  const handleLineContainerLeave = () => {
    setLineHoverActive(false);
  };

  // Calculate summary statistics
  const totalBalance = useMemo(
    () => state.transactions.reduce((sum, t) => sum + t.amount, 0),
    [state.transactions]
  );

  const totalIncome = useMemo(
    () => state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [state.transactions]
  );

  const totalExpenses = useMemo(
    () => Math.abs(state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)),
    [state.transactions]
  );

  // Prepare balance over time chart data
  const balanceData = useMemo(() => {
    return state.transactions
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc, t) => {
        const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        acc.push({
          date: t.date,
          balance: lastBalance + t.amount
        });
        return acc;
      }, [] as { date: string; balance: number }[]);
  }, [state.transactions]);

  // Prepare spending by category chart data
  const categoryData = useMemo(() => {
    return state.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
  }, [state.transactions]);

  const pieData = useMemo(
    () => Object.entries(categoryData).map(([name, value]) => ({ name, value })),
    [categoryData]
  );

  const pieLabelData = useMemo(() => {
    const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
    return pieData.map(({ name, value }) => `${name} ${total ? Math.round((value / total) * 100) : 0}%`);
  }, [pieData]);

  const hasTransactions = state.transactions.length > 0;

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">Good Evening, User 👋 — Here’s your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" value={totalBalance} icon="💰" />
        <SummaryCard title="Total Income" value={totalIncome} icon="📈" />
        <SummaryCard title="Total Expenses" value={totalExpenses} icon="📉" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Balance Over Time */}
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition duration-300 hover:bg-blue-100 dark:hover:bg-blue-200/20 hover:shadow-lg"
          onMouseEnter={handleLineContainerEnter}
          onMouseLeave={handleLineContainerLeave}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">📊</span>
            Balance Over Time
          </h3>
          {hasTransactions ? (
            <ResponsiveContainer width="100%" height={300} key={`line-chart-${lineAnimationKey}`}>
              <LineChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Balance']} />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 px-4">
              No balance history available yet.
            </div>
          )}
        </div>

        {/* Spending by Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-300/20 hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">🥧</span>
            Spending by Category
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <MemoPieChart data={pieData} labelData={pieLabelData} />
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 px-4">
              No spending categories available yet.
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition duration-300">
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