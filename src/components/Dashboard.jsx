import React, { useState, useEffect } from 'react';
import Modal from './UI/Modal';
import ExpenseForm from './ExpenseForm';
import CategoryChart from './Charts/CategoryChart';
import TrendChart from './Charts/TrendChart';
import BudgetProgress from './Charts/BudgetProgress';
import {
    groupByMonth,
    calculateTotal,
    getTopCategories,
    calculateBudgetUtilization,
    calculateMonthlyTrend
} from '../utils/calculations';
import { format } from 'date-fns';
import { saveBalance, getBalance } from '../utils/storage';

export default function Dashboard({ expenses, onAddExpense, budgets }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
    const [accountBalance, setAccountBalance] = useState(0);
    const [balanceInput, setBalanceInput] = useState('');

    // Load balance on mount
    useEffect(() => {
        setAccountBalance(getBalance());
    }, []);

    const currentMonthExpenses = groupByMonth(expenses);
    const totalThisMonth = calculateTotal(currentMonthExpenses);
    const totalAllExpenses = calculateTotal(expenses);
    const remainingBalance = accountBalance - totalAllExpenses;

    const topCategories = getTopCategories(currentMonthExpenses, 5);
    const monthlyTrend = calculateMonthlyTrend(expenses);
    const budgetUtilization = calculateBudgetUtilization(currentMonthExpenses, budgets);

    const handleAddExpense = (expense) => {
        onAddExpense(expense);
        setIsAddModalOpen(false);
    };

    const handleSetBalance = () => {
        const balance = parseFloat(balanceInput);
        if (!isNaN(balance) && balance >= 0) {
            setAccountBalance(balance);
            saveBalance(balance);
            setIsBalanceModalOpen(false);
            setBalanceInput('');
        }
    };

    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="container">
            {/* Account Balance Card */}
            <div className="card mb-4" style={{
                background: remainingBalance >= 0
                    ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
                    : 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
                <div className="flex justify-between items-center">
                    <div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                            💳 Account Balance
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.5rem' }}>
                            ₹{remainingBalance.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                            Initial: ₹{accountBalance.toFixed(2)} • Spent: ₹{totalAllExpenses.toFixed(2)}
                        </div>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setBalanceInput(accountBalance.toString());
                            setIsBalanceModalOpen(true);
                        }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        ⚙️ Set Balance
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-4 mb-4">
                <div className="stat-card">
                    <div className="stat-label">This Month</div>
                    <div className="stat-value">₹{totalThisMonth.toFixed(2)}</div>
                    <div className="stat-change">{format(new Date(), 'MMMM yyyy')}</div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-label">Total Expenses</div>
                    <div className="stat-value">{expenses.length}</div>
                    <div className="stat-change">All time</div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                    <div className="stat-label">Categories</div>
                    <div className="stat-value">{topCategories.length}</div>
                    <div className="stat-change">Active this month</div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                    <div className="stat-label">Average/Day</div>
                    <div className="stat-value">
                        ₹{currentMonthExpenses.length > 0 ? (totalThisMonth / new Date().getDate()).toFixed(0) : '0'}
                    </div>
                    <div className="stat-change">This month</div>
                </div>
            </div>

            {/* Quick Add Button */}
            <div className="mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    ➕ Add New Expense
                </button>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-2 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Spending by Category</h3>
                    </div>
                    <CategoryChart data={topCategories} />
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Monthly Trend</h3>
                    </div>
                    <TrendChart data={monthlyTrend} />
                </div>
            </div>

            <div className="grid grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Budget Tracking</h3>
                    </div>
                    {Object.keys(budgets).length > 0 ? (
                        <BudgetProgress budgets={budgetUtilization} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">💰</div>
                            <p className="empty-state-text">No budgets set yet</p>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                Set budgets in your expenses to track spending limits
                            </p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Expenses</h3>
                    </div>
                    {recentExpenses.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {recentExpenses.map(expense => (
                                <div key={expense.id} className="flex justify-between items-center">
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{expense.category}</div>
                                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                            {format(new Date(expense.date), 'MMM dd, yyyy')}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--primary-500)' }}>
                                        ₹{expense.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p className="empty-state-text">No expenses yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Expense Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Expense"
            >
                <ExpenseForm
                    onSubmit={handleAddExpense}
                    onCancel={() => setIsAddModalOpen(false)}
                />
            </Modal>

            {/* Set Balance Modal */}
            <Modal
                isOpen={isBalanceModalOpen}
                onClose={() => setIsBalanceModalOpen(false)}
                title="Set Account Balance"
            >
                <div>
                    <p className="text-secondary mb-3">
                        Set your initial account balance. This will be your starting point, and all expenses will be deducted from this amount.
                    </p>
                    <div className="form-group">
                        <label className="form-label">Account Balance (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={balanceInput}
                            onChange={(e) => setBalanceInput(e.target.value)}
                            placeholder="Enter your account balance"
                            min="0"
                            step="0.01"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleSetBalance}
                            style={{ flex: 1 }}
                        >
                            💾 Save Balance
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsBalanceModalOpen(false);
                                setBalanceInput('');
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
