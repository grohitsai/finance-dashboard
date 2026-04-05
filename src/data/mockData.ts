import type { Transaction } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-04-01',
    amount: 5000,
    category: 'Salary',
    type: 'income',
    description: 'Monthly salary'
  },
  {
    id: '2',
    date: '2024-04-02',
    amount: -250,
    category: 'Food',
    type: 'expense',
    description: 'Weekly groceries'
  },
  {
    id: '3',
    date: '2024-04-03',
    amount: -45,
    category: 'Transportation',
    type: 'expense',
    description: 'Bus pass'
  },
  {
    id: '4',
    date: '2024-04-04',
    amount: 800,
    category: 'Freelance',
    type: 'income',
    description: 'Web development project'
  },
  {
    id: '5',
    date: '2024-04-05',
    amount: -180,
    category: 'Entertainment',
    type: 'expense',
    description: 'Movie night'
  },
  {
    id: '6',
    date: '2024-04-06',
    amount: -120,
    category: 'Utilities',
    type: 'expense',
    description: 'Electricity bill'
  },
  {
    id: '7',
    date: '2024-04-07',
    amount: -85,
    category: 'Food',
    type: 'expense',
    description: 'Restaurant dinner'
  },
  {
    id: '8',
    date: '2024-04-08',
    amount: 300,
    category: 'Investment',
    type: 'income',
    description: 'Stock dividends'
  },
  {
    id: '9',
    date: '2024-04-09',
    amount: -150,
    category: 'Shopping',
    type: 'expense',
    description: 'New clothes'
  },
  {
    id: '10',
    date: '2024-04-10',
    amount: -75,
    category: 'Healthcare',
    type: 'expense',
    description: 'Doctor visit'
  },
  {
    id: '11',
    date: '2024-04-11',
    amount: -200,
    category: 'Rent',
    type: 'expense',
    description: 'Monthly rent'
  },
  {
    id: '12',
    date: '2024-04-12',
    amount: -30,
    category: 'Transportation',
    type: 'expense',
    description: 'Gas refill'
  },
  {
    id: '13',
    date: '2024-04-13',
    amount: -95,
    category: 'Food',
    type: 'expense',
    description: 'Coffee and snacks'
  },
  {
    id: '14',
    date: '2024-04-14',
    amount: 150,
    category: 'Other',
    type: 'income',
    description: 'Gift money'
  },
  {
    id: '15',
    date: '2024-04-15',
    amount: -60,
    category: 'Entertainment',
    type: 'expense',
    description: 'Concert tickets'
  }
];

export const categories = [
  'Salary',
  'Freelance',
  'Investment',
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Rent',
  'Other'
];