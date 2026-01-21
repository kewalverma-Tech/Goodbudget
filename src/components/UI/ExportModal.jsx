import React from 'react';
import Modal from './Modal';

export default function ExportModal({ isOpen, onClose, onExport }) {
    if (!isOpen) return null;

    const exportOptions = [
        {
            id: 'expenses-csv',
            title: '📊 Expenses (Excel/CSV)',
            description: 'Download expenses as CSV - Opens in Excel, Google Sheets',
            action: () => {
                onExport('expenses-csv');
                onClose();
            }
        },
        {
            id: 'investments-csv',
            title: '💼 Investments (Excel/CSV)',
            description: 'Download investments as CSV - Opens in Excel, Google Sheets',
            action: () => {
                onExport('investments-csv');
                onClose();
            }
        },
        {
            id: 'all-json',
            title: '💾 Complete Backup (JSON)',
            description: 'Full backup with all data - For restoring later',
            action: () => {
                onExport('all-json');
                onClose();
            }
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="📥 Export Data"
        >
            <div className="export-options">
                {exportOptions.map(option => (
                    <button
                        key={option.id}
                        className="export-option-card"
                        onClick={option.action}
                    >
                        <div className="export-option-title">{option.title}</div>
                        <div className="export-option-desc">{option.description}</div>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .export-options {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .export-option-card {
                    width: 100%;
                    padding: var(--spacing-lg);
                    border: 2px solid var(--border);
                    border-radius: var(--radius-lg);
                    background: var(--surface);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    text-align: left;
                }

                .export-option-card:hover {
                    border-color: var(--primary-500);
                    background: rgba(102, 126, 234, 0.05);
                    transform: translateX(4px);
                }

                .export-option-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-xs);
                }

                .export-option-desc {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                @media (max-width: 768px) {
                    .export-option-title {
                        font-size: 1rem;
                    }

                    .export-option-desc {
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </Modal>
    );
}
