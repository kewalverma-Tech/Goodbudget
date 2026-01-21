import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/UI/Header';
import Navigation from './components/UI/Navigation';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import InvestmentTracker from './components/InvestmentTracker';
import {
  loadExpenses,
  saveExpenses,
  loadInvestments,
  saveInvestments,
  loadBudgets,
  saveBudgets,
  loadSettings,
  saveSettings,
} from './utils/storage';
import { exportAllData, exportExpensesCSV, exportInvestmentsCSV } from './utils/export';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [settings, setSettings] = useState({ theme: 'light' });
  const [activeView, setActiveView] = useState('dashboard');

  // Load data on mount
  useEffect(() => {
    const loadedExpenses = loadExpenses();
    const loadedInvestments = loadInvestments();
    const loadedBudgets = loadBudgets();
    const loadedSettings = loadSettings();

    setExpenses(loadedExpenses);
    setInvestments(loadedInvestments);
    setBudgets(loadedBudgets);
    setSettings(loadedSettings);

    // Apply theme
    document.documentElement.setAttribute('data-theme', loadedSettings.theme);
  }, []);

  // Save expenses whenever they change
  useEffect(() => {
    if (expenses.length > 0 || localStorage.getItem('expense_tracker_expenses')) {
      saveExpenses(expenses);
    }
  }, [expenses]);

  // Save investments whenever they change
  useEffect(() => {
    if (investments.length > 0 || localStorage.getItem('expense_tracker_investments')) {
      saveInvestments(investments);
    }
  }, [investments]);

  // Save budgets whenever they change
  useEffect(() => {
    if (Object.keys(budgets).length > 0 || localStorage.getItem('expense_tracker_budgets')) {
      saveBudgets(budgets);
    }
  }, [budgets]);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  // Expense handlers
  const handleAddExpense = (expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses(prev =>
      prev.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp))
    );
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Investment handlers
  const handleAddInvestment = (investment) => {
    setInvestments(prev => [investment, ...prev]);
  };

  const handleUpdateInvestment = (updatedInvestment) => {
    setInvestments(prev =>
      prev.map(inv => (inv.id === updatedInvestment.id ? updatedInvestment : inv))
    );
  };

  const handleDeleteInvestment = (id) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  // Theme toggle
  const handleToggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  // Export data
  const handleExport = () => {
    const choice = window.confirm(
      'Export all data as JSON?\n\nOK = JSON (full backup)\nCancel = Choose specific export'
    );

    if (choice) {
      exportAllData(expenses, investments);
    } else {
      const csvChoice = window.confirm(
        'Export expenses or investments?\n\nOK = Expenses (CSV)\nCancel = Investments (CSV)'
      );

      if (csvChoice) {
        exportExpensesCSV(expenses);
      } else {
        exportInvestmentsCSV(investments);
      }
    }
  };

  // Set default budgets if none exist
  useEffect(() => {
    if (Object.keys(budgets).length === 0 && expenses.length === 0) {
      setBudgets({
        'Food': 10000,
        'Transport': 5000,
        'Shopping': 8000,
        'Bills': 15000,
        'Entertainment': 5000
      });
    }
  }, []);

  // Render active view
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            expenses={expenses}
            onAddExpense={handleAddExpense}
            budgets={budgets}
          />
        );
      case 'expenses':
        return (
          <ExpenseList
            expenses={expenses}
            onUpdate={handleUpdateExpense}
            onDelete={handleDeleteExpense}
          />
        );
      case 'weekly':
        return <WeeklyView expenses={expenses} />;
      case 'monthly':
        return <MonthlyView expenses={expenses} budgets={budgets} />;
      case 'investments':
        return (
          <InvestmentTracker
            investments={investments}
            onAddInvestment={handleAddInvestment}
            onUpdateInvestment={handleUpdateInvestment}
            onDeleteInvestment={handleDeleteInvestment}
          />
        );
      default:
        return (
          <Dashboard
            expenses={expenses}
            onAddExpense={handleAddExpense}
            budgets={budgets}
          />
        );
    }
  };

  return (
    <div className="app">
      <Header
        onToggleTheme={handleToggleTheme}
        theme={settings.theme}
        onExport={handleExport}
      />
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      {renderView()}
    </div>
  );
}

export default App;
