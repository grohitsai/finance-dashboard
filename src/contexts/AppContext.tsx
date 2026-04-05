import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, Transaction, Role } from '../types';
import { mockTransactions } from '../data/mockData';

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> };

const initialState: AppState = {
  transactions: mockTransactions, // Initialize with mock data
  role: 'Viewer',
  darkMode: false,
  filters: {
    search: '',
    category: '',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  }
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on app initialization
    try {
      const savedTransactions = localStorage.getItem('transactions');
      const savedRole = localStorage.getItem('role');
      const savedDarkMode = localStorage.getItem('darkMode');

      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions);
        // Check if we have valid transactions (not empty array)
        if (Array.isArray(parsedTransactions) && parsedTransactions.length > 0) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: parsedTransactions });
        }
        // If no valid saved transactions, keep the mock data that's already loaded
      }

      if (savedRole && (savedRole === 'Viewer' || savedRole === 'Admin')) {
        dispatch({ type: 'SET_ROLE', payload: savedRole });
      }

      if (savedDarkMode === 'true') {
        dispatch({ type: 'TOGGLE_DARK_MODE' });
        // Also apply the class immediately to prevent flash
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Keep mock data that's already loaded
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
    localStorage.setItem('role', state.role);
    localStorage.setItem('darkMode', state.darkMode.toString());
  }, [state.transactions, state.role, state.darkMode]);

  useEffect(() => {
    // Apply dark mode class to document
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => { // eslint-disable-line react-refresh/only-export-components
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};