import React, { useState } from 'react';
import { format } from 'date-fns';

const CATEGORIES = [
    { value: 'Food', icon: '🍔', color: '#ff6b6b' },
    { value: 'Transport', icon: '🚗', color: '#4ecdc4' },
    { value: 'Shopping', icon: '🛍️', color: '#45b7d1' },
    { value: 'Bills', icon: '📄', color: '#f9ca24' },
    { value: 'Entertainment', icon: '🎬', color: '#a29bfe' },
    { value: 'Health', icon: '💊', color: '#fd79a8' },
    { value: 'Investment', icon: '📈', color: '#00b894' },
    { value: 'Education', icon: '📚', color: '#6c5ce7' },
    { value: 'Other', icon: '💰', color: '#74b9ff' }
];

export default function ExpenseForm({ onSubmit, onCancel, initialData = null }) {
    const [formData, setFormData] = useState({
        amount: initialData?.amount || '',
        category: initialData?.category || 'Food',
        date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
        notes: initialData?.notes || '',
        tags: initialData?.tags?.join(', ') || '',
        isRecurring: initialData?.isRecurring || false,
        recurringFrequency: initialData?.recurringFrequency || 'monthly'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const expense = {
            ...formData,
            amount: parseFloat(formData.amount),
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            id: initialData?.id || crypto.randomUUID(),
            createdAt: initialData?.createdAt || new Date().toISOString()
        };

        onSubmit(expense);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                    type="number"
                    name="amount"
                    className="form-input"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Category</label>
                <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.value}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Date</label>
                <input
                    type="date"
                    name="date"
                    className="form-input"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    max={format(new Date(), 'yyyy-MM-dd')}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Notes / Reason</label>
                <textarea
                    name="notes"
                    className="form-textarea"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="What was this expense for?"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                    type="text"
                    name="tags"
                    className="form-input"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. groceries, monthly, urgent"
                />
            </div>

            <div className="form-group">
                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleChange}
                    />
                    <span className="form-label" style={{ marginBottom: 0 }}>Recurring Expense</span>
                </label>
            </div>

            {formData.isRecurring && (
                <div className="form-group">
                    <label className="form-label">Frequency</label>
                    <select
                        name="recurringFrequency"
                        className="form-select"
                        value={formData.recurringFrequency}
                        onChange={handleChange}
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            )}

            <div className="flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {initialData ? '💾 Update' : '➕ Add'} Expense
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export { CATEGORIES };
