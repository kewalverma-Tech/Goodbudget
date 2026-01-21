import React from 'react';

export default function BudgetProgress({ budgets }) {
    if (!budgets || Object.keys(budgets).length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <p className="empty-state-text">No budgets set</p>
            </div>
        );
    }

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return '#ef4444'; // Red
        if (percentage >= 75) return '#fbbf24'; // Yellow
        return '#22c55e'; // Green
    };

    return (
        <div className="flex flex-col gap-3">
            {Object.entries(budgets).map(([category, data]) => (
                <div key={category}>
                    <div className="flex justify-between mb-1">
                        <span className="font-weight-600">{category}</span>
                        <span className="text-secondary">
                            ₹{data.spent.toFixed(0)} / ₹{data.budget.toFixed(0)}
                        </span>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar"
                            style={{
                                width: `${Math.min(data.percentage, 100)}%`,
                                background: getProgressColor(data.percentage)
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                            {data.percentage.toFixed(1)}% used
                        </span>
                        {data.isOverBudget ? (
                            <span className="badge badge-danger">Over Budget!</span>
                        ) : (
                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                ₹{data.remaining.toFixed(0)} remaining
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
