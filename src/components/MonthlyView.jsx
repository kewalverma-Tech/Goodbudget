import React, { useState } from 'react';
import {
    startOfMonth,
    endOfMonth,
    addMonths,
    subMonths,
    format
} from 'date-fns';
import { groupByMonth, calculateTotal, calculateCategoryTotals, groupByDay } from '../utils/calculations';
import CategoryChart from './Charts/CategoryChart';
import TrendChart from './Charts/TrendChart';
import BudgetProgress from './Charts/BudgetProgress';
import { calculateBudgetUtilization, calculateWeeklyTrend } from '../utils/calculations';

export default function MonthlyView({ expenses, budgets }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthExpenses = groupByMonth(expenses, currentMonth);
    const monthTotal = calculateTotal(monthExpenses);
    const categoryTotals = calculateCategoryTotals(monthExpenses);
    const budgetUtilization = calculateBudgetUtilization(monthExpenses, budgets);

    const topCategories = Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

    const weeklyTrendData = calculateWeeklyTrend(monthExpenses);

    const dailyExpenses = groupByDay(monthExpenses);
    const topSpendingDays = Object.entries(dailyExpenses)
        .map(([date, exps]) => ({ date, total: calculateTotal(exps), count: exps.length }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    const goToPreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const goToCurrentMonth = () => {
        setCurrentMonth(new Date());
    };

    return (
        <div className="container">
            <div className="card mb-4">
                <div className="card-header">
                    <h2 className="card-title">Monthly Overview</h2>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary btn-small" onClick={goToPreviousMonth}>
                            ← Previous
                        </button>
                        <button className="btn btn-secondary btn-small" onClick={goToCurrentMonth}>
                            This Month
                        </button>
                        <button className="btn btn-secondary btn-small" onClick={goToNextMonth}>
                            Next →
                        </button>
                    </div>
                </div>

                <div className="text-center mb-3">
                    <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                </div>

                <div className="grid grid-4 mb-3">
                    <div className="stat-card">
                        <div className="stat-label">Total Spent</div>
                        <div className="stat-value">₹{monthTotal.toFixed(2)}</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <div className="stat-label">Transactions</div>
                        <div className="stat-value">{monthExpenses.length}</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <div className="stat-label">Daily Average</div>
                        <div className="stat-value">
                            ₹{monthExpenses.length > 0 ? (monthTotal / new Date(currentMonth).getDate()).toFixed(2) : '0'}
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                        <div className="stat-label">Categories</div>
                        <div className="stat-value">{topCategories.length}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-2 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Spending by Category</h3>
                    </div>
                    {topCategories.length > 0 ? (
                        <CategoryChart data={topCategories} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <p className="empty-state-text">No expenses this month</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Weekly Trend</h3>
                    </div>
                    {weeklyTrendData.length > 0 ? (
                        <TrendChart data={weeklyTrendData} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📈</div>
                            <p className="empty-state-text">No trend data</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-2 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Budget Tracking</h3>
                    </div>
                    {Object.keys(budgets).length > 0 ? (
                        <BudgetProgress budgets={budgetUtilization} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">💰</div>
                            <p className="empty-state-text">No budgets set</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Top Spending Days</h3>
                    </div>
                    {topSpendingDays.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {topSpendingDays.map(({ date, total, count }) => (
                                <div key={date} className="flex justify-between items-center">
                                    <div>
                                        <div style={{ fontWeight: 600 }}>
                                            {format(new Date(date), 'MMM dd, yyyy')}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                            {count} {count === 1 ? 'transaction' : 'transactions'}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--primary-500)' }}>
                                        ₹{total.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📅</div>
                            <p className="empty-state-text">No data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Details */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Category Breakdown</h3>
                </div>
                {topCategories.length > 0 ? (
                    <div className="grid grid-3">
                        {topCategories.map(({ category, amount }) => {
                            const percentage = ((amount / monthTotal) * 100).toFixed(1);
                            const budget = budgets[category];
                            const budgetInfo = budgetUtilization[category];

                            return (
                                <div key={category} className="card">
                                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
                                        {/* Category icon would go here */}
                                        💰
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 'var(--spacing-xs)' }}>
                                        {category}
                                    </div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-500)', marginBottom: 'var(--spacing-sm)' }}>
                                        ₹{amount.toFixed(2)}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="badge badge-primary">{percentage}% of total</span>
                                        {budget && budgetInfo && (
                                            <span className={`badge ${budgetInfo.isOverBudget ? 'badge-danger' : 'badge-success'}`}>
                                                {budgetInfo.percentage.toFixed(0)}% of budget
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <p className="empty-state-text">No expenses to show</p>
                    </div>
                )}
            </div>
        </div>
    );
}
