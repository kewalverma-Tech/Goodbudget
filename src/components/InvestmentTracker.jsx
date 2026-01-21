import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import Modal from './UI/Modal';
import { calculateROI } from '../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const INVESTMENT_TYPES = [
    { value: 'Stocks', icon: '📈', color: '#667eea' },
    { value: 'Mutual Funds', icon: '💼', color: '#764ba2' },
    { value: 'Crypto', icon: '₿', color: '#f093fb' },
    { value: 'Real Estate', icon: '🏠', color: '#f5576c' },
    { value: 'Fixed Deposit', icon: '🏦', color: '#fa709a' },
    { value: 'Gold', icon: '💰', color: '#fee140' },
    { value: 'Other', icon: '📊', color: '#30cfd0' }
];

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#fa709a', '#fee140', '#30cfd0'];

export default function InvestmentTracker({ investments, onAddInvestment, onUpdateInvestment, onDeleteInvestment }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        type: 'Stocks',
        date: format(new Date(), 'yyyy-MM-dd'),
        purpose: '',
        currentValue: '',
        notes: ''
    });

    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.currentValue || inv.amount || 0), 0);
    const totalProfit = totalCurrentValue - totalInvested;
    const totalROI = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : 0;

    const typeDistribution = INVESTMENT_TYPES.map(type => {
        const typeInvestments = investments.filter(inv => inv.type === type.value);
        const amount = typeInvestments.reduce((sum, inv) => sum + parseFloat(inv.currentValue || inv.amount || 0), 0);
        return {
            name: type.value,
            value: amount,
            fill: type.color
        };
    }).filter(item => item.value > 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const investment = {
            ...formData,
            amount: parseFloat(formData.amount),
            currentValue: formData.currentValue ? parseFloat(formData.currentValue) : parseFloat(formData.amount),
            id: editingInvestment?.id || crypto.randomUUID(),
            createdAt: editingInvestment?.createdAt || new Date().toISOString()
        };

        if (editingInvestment) {
            onUpdateInvestment(investment);
            setEditingInvestment(null);
        } else {
            onAddInvestment(investment);
            setIsAddModalOpen(false);
        }

        setFormData({
            amount: '',
            type: 'Stocks',
            date: format(new Date(), 'yyyy-MM-dd'),
            purpose: '',
            currentValue: '',
            notes: ''
        });
    };

    const handleEdit = (investment) => {
        setEditingInvestment(investment);
        setFormData({
            amount: investment.amount,
            type: investment.type,
            date: investment.date,
            purpose: investment.purpose || '',
            currentValue: investment.currentValue || investment.amount,
            notes: investment.notes || ''
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this investment?')) {
            onDeleteInvestment(id);
        }
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingInvestment(null);
        setFormData({
            amount: '',
            type: 'Stocks',
            date: format(new Date(), 'yyyy-MM-dd'),
            purpose: '',
            currentValue: '',
            notes: ''
        });
    };

    return (
        <div className="container">
            {/* Summary Stats */}
            <div className="grid grid-4 mb-4">
                <div className="stat-card">
                    <div className="stat-label">Total Invested</div>
                    <div className="stat-value">₹{totalInvested.toFixed(2)}</div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-label">Current Value</div>
                    <div className="stat-value">₹{totalCurrentValue.toFixed(2)}</div>
                </div>

                <div className="stat-card" style={{
                    background: totalProfit >= 0
                        ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                        : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                }}>
                    <div className="stat-label">Profit/Loss</div>
                    <div className="stat-value">
                        {totalProfit >= 0 ? '+' : ''}₹{totalProfit.toFixed(2)}
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                    <div className="stat-label">ROI</div>
                    <div className="stat-value">{totalROI}%</div>
                </div>
            </div>

            {/* Add Investment Button */}
            <div className="mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    ➕ Add Investment
                </button>
            </div>

            <div className="grid grid-2 mb-4">
                {/* Portfolio Distribution Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Portfolio Distribution</h3>
                    </div>
                    {typeDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={typeDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => `₹${entry.value.toFixed(0)}`}
                                >
                                    {typeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <p className="empty-state-text">No investments yet</p>
                        </div>
                    )}
                </div>

                {/* Type Summary */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Investment Types</h3>
                    </div>
                    {typeDistribution.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {typeDistribution.map(({ name, value }) => {
                                const percentage = ((value / totalCurrentValue) * 100).toFixed(1);
                                return (
                                    <div key={name} className="flex justify-between items-center">
                                        <div>
                                            <span style={{ fontWeight: 600 }}>{name}</span>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                {percentage}% of portfolio
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 700, color: 'var(--primary-500)' }}>
                                            ₹{value.toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p className="empty-state-text">No data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Investments List */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Investments</h3>
                </div>
                {investments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">💼</div>
                        <p className="empty-state-text">No investments recorded</p>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                            Start tracking your investments to monitor your portfolio
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-2">
                        {investments.map(investment => {
                            const roi = calculateROI(investment);

                            return (
                                <div key={investment.id} className="card">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>
                                                {INVESTMENT_TYPES.find(t => t.value === investment.type)?.icon || '📊'}
                                            </div>
                                            <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                                                {investment.type}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                {format(parseISO(investment.date), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                className="btn btn-icon btn-small btn-secondary"
                                                onClick={() => handleEdit(investment)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-icon btn-small btn-secondary"
                                                onClick={() => handleDelete(investment.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {investment.purpose && (
                                        <div className="mb-2">
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                Purpose: {investment.purpose}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-2 mb-2" style={{ gap: 'var(--spacing-sm)' }}>
                                        <div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Invested</div>
                                            <div style={{ fontWeight: 700 }}>₹{roi.initial.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Current Value</div>
                                            <div style={{ fontWeight: 700 }}>₹{roi.current.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className={`badge ${roi.profit >= 0 ? 'badge-success' : 'badge-danger'}`}>
                                                {roi.profit >= 0 ? '+' : ''}₹{roi.profit.toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`badge ${roi.roi >= 0 ? 'badge-success' : 'badge-danger'}`}>
                                                ROI: {roi.roi >= 0 ? '+' : ''}{roi.roi}%
                                            </span>
                                        </div>
                                    </div>

                                    {investment.notes && (
                                        <div className="mt-2 text-muted" style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                                            {investment.notes}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add/Edit Investment Modal */}
            <Modal
                isOpen={isAddModalOpen || !!editingInvestment}
                onClose={handleCloseModal}
                title={editingInvestment ? 'Edit Investment' : 'Add New Investment'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Investment Type</label>
                        <select
                            name="type"
                            className="form-select"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            {INVESTMENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount Invested (₹)</label>
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
                        <label className="form-label">Current Value (₹)</label>
                        <input
                            type="number"
                            name="currentValue"
                            className="form-input"
                            value={formData.currentValue}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="Leave blank if same as invested amount"
                        />
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
                        <label className="form-label">Purpose / Reason</label>
                        <input
                            type="text"
                            name="purpose"
                            className="form-input"
                            value={formData.purpose}
                            onChange={handleChange}
                            placeholder="Why did you make this investment?"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea
                            name="notes"
                            className="form-textarea"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional details..."
                        />
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {editingInvestment ? '💾 Update' : '➕ Add'} Investment
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
