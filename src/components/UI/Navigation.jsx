import React from 'react';

export default function Navigation({ activeView, onViewChange }) {
    const views = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'expenses', label: '💸 All Expenses', icon: '💸' },
        { id: 'weekly', label: '📅 Weekly', icon: '📅' },
        { id: 'monthly', label: '📆 Monthly', icon: '📆' },
        { id: 'investments', label: '📈 Investments', icon: '📈' }
    ];

    return (
        <nav className="navigation">
            <div className="nav-tabs">
                {views.map(view => (
                    <button
                        key={view.id}
                        className={`nav-tab ${activeView === view.id ? 'active' : ''}`}
                        onClick={() => onViewChange(view.id)}
                    >
                        {view.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
