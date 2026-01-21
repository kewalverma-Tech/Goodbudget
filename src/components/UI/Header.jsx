import React from 'react';

export default function Header({ onToggleTheme, theme, onExport }) {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">💰 Expense Tracker</div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary btn-small"
                        onClick={onExport}
                        title="Export Data"
                    >
                        📥 Export
                    </button>
                    <button
                        className="btn btn-icon btn-secondary"
                        onClick={onToggleTheme}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </header>
    );
}
