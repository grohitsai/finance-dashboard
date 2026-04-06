# Finance Dashboard

A clean and responsive Finance Dashboard built with React, TypeScript, Tailwind CSS, and Recharts.

## Features

- **Dashboard Overview**: Summary cards for Balance, Income, and Expenses
- **Charts**: Line chart for balance over time, Pie chart for spending by category
- **Transactions Management**: View, search, filter, and sort transactions
- **Role-Based UI**: Viewer mode (read-only) and Admin mode (full access)
- **Insights**: Simple financial insights and recommendations
- **Dark Mode**: Toggle between light and dark themes
- **Data Persistence**: Transactions stored in localStorage
- **Export**: Export transactions as CSV

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Context API with useReducer
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx       # App header with navigation
│   ├── Dashboard.tsx    # Main dashboard page
│   ├── Transactions.tsx # Transactions management page
│   ├── Insights.tsx     # Insights and analytics page
│   └── SummaryCard.tsx  # Summary card component
├── contexts/            # React Context for state management
│   └── AppContext.tsx   # App state and actions
├── data/                # Mock data
│   └── mockData.ts      # Sample transactions
├── types/               # TypeScript type definitions
│   └── index.ts         # App types
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── index.css            # Global styles with Tailwind
```

## State Management

The app uses React Context API with useReducer for state management:

- **Transactions**: Array of transaction objects
- **Filters**: Search, category, type, sort options
- **Role**: Viewer or Admin
- **Dark Mode**: Theme toggle

Data is persisted in localStorage and loaded on app start.

## Mock Data

The app includes sample transaction data for demonstration. In a real application, this would be replaced with API calls.

## Responsive Design

The dashboard is fully responsive and works on desktop, tablet, and mobile devices.

## License

This project is for educational purposes.
