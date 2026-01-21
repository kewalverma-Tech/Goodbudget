import React, { useState } from 'react';
import {
    startOfWeek,
    endOfWeek,
    addWeeks,
    subWeeks,
    eachDayOfInterval,
    format,
    isSameDay,
    parseISO
} from 'date-fns';
import { groupByWeek, calculateTotal, calculateCategoryTotals } from '../utils/calculations';
import CategoryChart from './Charts/CategoryChart';

export default function WeeklyView({ expenses }) {
    const [currentWeekStart, setCurrentWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    const weekExpenses = groupByWeek(expenses, currentWeekStart);
    const weekTotal = calculateTotal(weekExpenses);
    const categoryTotals = calculateCategoryTotals(weekExpenses);
    const topCategories = Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

    const goToPreviousWeek = () => {
        setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    };

    const goToNextWeek = () => {
        setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    };

    const goToCurrentWeek = () => {
        setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    };

    const getDayExpenses = (day) => {
        return weekExpenses.filter(expense =>
            isSameDay(parseISO(expense.date), day)
        );
    };

    const getDayTotal = (day) => {
        return calculateTotal(getDayExpenses(day));
    };

    return (
        <div className="container">
            <div className="card mb-4">
                <div className="card-header">
                    <h2 className="card-title">Weekly Overview</h2>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary btn-small" onClick={goToPreviousWeek}>
                            ← Previous
                        </button>
                        <button className="btn btn-secondary btn-small" onClick={goToCurrentWeek}>
                            This Week
                        </button>
                        <button className="btn btn-secondary btn-small" onClick={goToNextWeek}>
                            Next →
                        </button>
                    </div>
                </div>

                <div className="text-center mb-3">
                    <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        {format(currentWeekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
                    </h3>
                </div>

                <div className="grid grid-3 mb-3">
                    <div className="stat-card">
                        <div className="stat-label">Total Spent</div>
                        <div className="stat-value">₹{weekTotal.toFixed(2)}</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <div className="stat-label">Transactions</div>
                        <div className="stat-value">{weekExpenses.length}</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <div className="stat-label">Daily Average</div>
                        <div className="stat-value">₹{(weekTotal / 7).toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-2 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Category Breakdown</h3>
                    </div>
                    {topCategories.length > 0 ? (
                        <CategoryChart data={topCategories} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <p className="empty-state-text">No expenses this week</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Top Categories</h3>
                    </div>
                    {topCategories.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {topCategories.map(({ category, amount }) => (
                                <div key={category} className="flex justify-between items-center">
                                    <span style={{ fontWeight: 600 }}>{category}</span>
                                    <span style={{ fontWeight: 700, color: 'var(--primary-500)' }}>
                                        ₹{amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p className="empty-state-text">No data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Breakdown */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Daily Breakdown</h3>
                </div>
                <div className="grid grid-2">
                    {daysOfWeek.map(day => {
                        const dayExpenses = getDayExpenses(day);
                        const dayTotal = getDayTotal(day);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toString()}
                                className="card"
                                style={{
                                    background: isToday ? 'var(--primary-gradient)' : 'var(--surface)',
                                    color: isToday ? 'white' : 'inherit',
                                    border: isToday ? 'none' : undefined
                                }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                                            {format(day, 'EEEE')}
                                        </div>
                                        <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>
                                            {format(day, 'MMM dd')}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                                            ₹{dayTotal.toFixed(2)}
                                        </div>
                                        <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>
                                            {dayExpenses.length} {dayExpenses.length === 1 ? 'expense' : 'expenses'}
                                        </div>
                                    </div>
                                </div>
                                {dayExpenses.length > 0 && (
                                    <div className="flex flex-col gap-1 mt-2" style={{ fontSize: '0.875rem' }}>
                                        {dayExpenses.slice(0, 3).map(expense => (
                                            <div key={expense.id} className="flex justify-between">
                                                <span>{expense.category}</span>
                                                <span>₹{expense.amount.toFixed(0)}</span>
                                            </div>
                                        ))}
                                        {dayExpenses.length > 3 && (
                                            <div style={{ opacity: 0.7, fontStyle: 'italic' }}>
                                                +{dayExpenses.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
