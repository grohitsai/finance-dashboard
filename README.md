# 💰 Finance Dashboard

A modern and responsive **Finance Dashboard** built using **React, TypeScript, Tailwind CSS, and Recharts**.
This application provides a clear overview of financial data with interactive visualizations and a smooth user experience.

---

## 🚀 Features

* 📊 **Dashboard Overview**
  Displays Total Balance, Income, and Expenses using summary cards

* 📈 **Interactive Charts**

  * Line chart for balance over time
  * Pie chart for spending by category

* 🔍 **Transactions Management**
  Search, filter, and sort transactions easily

* 👤 **Role-Based UI**

  * Viewer Mode (read-only)
  * Admin Mode (full access)

* 💡 **Insights**
  Basic financial insights and recommendations

* 🌙 **Dark Mode**
  Toggle between light and dark themes

* 💾 **Data Persistence**
  Data stored in localStorage

* 📤 **Export Feature**
  Download transactions as CSV

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript
* **Styling**: Tailwind CSS
* **Charts**: Recharts
* **State Management**: React Context API with useReducer
* **Build Tool**: Vite

---

## 🌐 Live Demo

👉 https://finance-dashboard-brown-theta.vercel.app/

> The deployed version is fully functional and recommended for use.

---

## ⚙️ Getting Started (Optional)

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

```bash
git clone https://github.com/grohitsai/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

> If you face any issues running locally, please use the live deployed version.

---

## 📦 Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Insights.tsx
│   └── SummaryCard.tsx
├── contexts/
│   └── AppContext.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🧠 State Management

The application uses **React Context API with useReducer** to manage:

* Transactions data
* Filters (search, category, sorting)
* User roles (Viewer/Admin)
* Theme (Light/Dark mode)

All data is persisted using **localStorage**.

---

## 📱 Responsive Design

Fully responsive and optimized for:

* Desktop
* Tablet
* Mobile

---

## 📌 Note

This project is built for **educational and demonstration purposes**.

---

## 📄 License

This project is for educational use only.
