import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent transform transition-all duration-300 hover:scale-105 hover:bg-green-100 dark:hover:bg-green-400/20 dark:hover:border-green-400 dark:hover:shadow-green-400/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
          </p>
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
    </div>
  );
};

export default SummaryCard;