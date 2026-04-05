import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import SummaryCard from './SummaryCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const [lineChartKey, setLineChartKey] = useState(0);
  const [pieChartKey, setPieChartKey] = useState(0);
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const handleLineHover = () => setLineChartKey(prev => prev + 1);
  const handlePieHover = () => setPieChartKey(prev => prev + 1);

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 18) * cos;
    const my = cy + (outerRadius + 18) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 14}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.2}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`₹${value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

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
  const activePieProps: any = activePieIndex !== null ? { activeIndex: activePieIndex } : {};

  const hasTransactions = state.transactions.length > 0;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm transform transition duration-300 hover:scale-105 hover:shadow-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">Good Evening, Rohit 👋</p>
        <h2 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">Here’s your financial overview</h2>
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
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-lg"
          onMouseEnter={handleLineHover}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">📊</span>
            Balance Over Time
          </h3>
          {hasTransactions ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart key={lineChartKey} data={balanceData}>
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
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-lg"
          onMouseEnter={handlePieHover}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">🥧</span>
            Spending by Category
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart key={pieChartKey}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  {...activePieProps}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 px-4">
              No spending categories available yet.
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-100 hover:shadow-lg">
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