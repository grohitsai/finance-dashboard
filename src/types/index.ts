export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description?: string;
}

export type Role = 'Viewer' | 'Admin';

export interface AppState {
  transactions: Transaction[];
  role: Role;
  darkMode: boolean;
  filters: {
    search: string;
    category: string;
    type: 'all' | 'income' | 'expense';
    sortBy: 'date' | 'amount';
    sortOrder: 'asc' | 'desc';
  };
}