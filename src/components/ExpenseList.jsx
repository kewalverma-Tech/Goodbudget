import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CATEGORIES } from './ExpenseForm';
import Modal from './UI/Modal';
import ExpenseForm from './ExpenseForm';
import { searchExpenses, sortExpenses } from '../utils/calculations';

const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat?.icon || '💰';
};

export default function ExpenseList({ expenses, onUpdate, onDelete }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [editingExpense, setEditingExpense] = useState(null);

    // Filter and sort expenses
    let filteredExpenses = expenses;

    if (searchQuery) {
        filteredExpenses = searchExpenses(filteredExpenses, searchQuery);
    }

    if (filterCategory) {
        filteredExpenses = filteredExpenses.filter(e => e.category === filterCategory);
    }

    filteredExpenses = sortExpenses(filteredExpenses, sortBy, sortOrder);

    const handleEdit = (expense) => {
        setEditingExpense(expense);
    };

    const handleUpdate = (updatedExpense) => {
        onUpdate(updatedExpense);
        setEditingExpense(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            onDelete(id);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">All Expenses</h2>
                    <div className="flex gap-2">
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ width: 'auto' }}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="category">Sort by Category</option>
                        </select>
                        <button
                            className="btn btn-icon btn-secondary"
                            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                            title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
                        >
                            {sortOrder === 'asc' ? '⬆️' : '⬇️'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-2 mb-3">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search expenses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <select
                            className="form-select"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.icon} {cat.value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredExpenses.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <p className="empty-state-text">No expenses found</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filteredExpenses.map(expense => (
                            <div key={expense.id} className="expense-item">
                                <div className="expense-icon">
                                    {getCategoryIcon(expense.category)}
                                </div>
                                <div className="expense-details">
                                    <div className="expense-category">{expense.category}</div>
                                    {expense.notes && (
                                        <div className="expense-note">{expense.notes}</div>
                                    )}
                                    {expense.tags && expense.tags.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                            {expense.tags.map((tag, idx) => (
                                                <span key={idx} className="badge badge-primary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="expense-date">
                                        {format(parseISO(expense.date), 'MMM dd, yyyy')}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
                                    {expense.isRecurring && (
                                        <span className="badge badge-success mt-1">
                                            🔄 {expense.recurringFrequency}
                                        </span>
                                    )}
                                </div>
                                <div className="expense-actions">
                                    <button
                                        className="btn btn-icon btn-small btn-secondary"
                                        onClick={() => handleEdit(expense)}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-icon btn-small btn-secondary"
                                        onClick={() => handleDelete(expense.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!editingExpense}
                onClose={() => setEditingExpense(null)}
                title="Edit Expense"
            >
                {editingExpense && (
                    <ExpenseForm
                        initialData={editingExpense}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingExpense(null)}
                    />
                )}
            </Modal>
        </div>
    );
}
