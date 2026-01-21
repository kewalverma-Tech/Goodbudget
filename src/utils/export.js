import { format } from 'date-fns';

// Export expenses as CSV
export const exportToCSV = (expenses) => {
    if (!expenses || expenses.length === 0) {
        return '';
    }

    // CSV headers
    const headers = ['Date', 'Category', 'Amount', 'Notes', 'Tags', 'Recurring'];

    // Convert expenses to CSV rows
    const rows = expenses.map(expense => [
        format(new Date(expense.date), 'yyyy-MM-dd'),
        expense.category || '',
        expense.amount || 0,
        (expense.notes || '').replace(/"/g, '""'), // Escape quotes
        (expense.tags || []).join(', '),
        expense.isRecurring ? 'Yes' : 'No'
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
};

// Export investments as CSV
export const exportInvestmentsToCSV = (investments) => {
    if (!investments || investments.length === 0) {
        return '';
    }

    const headers = ['Date', 'Type', 'Amount', 'Current Value', 'Purpose', 'Notes'];

    const rows = investments.map(inv => [
        format(new Date(inv.date), 'yyyy-MM-dd'),
        inv.type || '',
        inv.amount || 0,
        inv.currentValue || inv.amount || 0,
        inv.purpose || '',
        (inv.notes || '').replace(/"/g, '""')
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
};

// Export as JSON
export const exportToJSON = (data) => {
    return JSON.stringify(data, null, 2);
};

// Download file helper
export const downloadFile = (content, filename, type = 'text/csv') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Export all data
export const exportAllData = (expenses, investments) => {
    const allData = {
        expenses,
        investments,
        exportDate: new Date().toISOString()
    };

    const jsonContent = exportToJSON(allData);
    const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
    downloadFile(jsonContent, `expense-tracker-backup_${timestamp}.json`, 'application/json');
};

// Export expenses only
export const exportExpensesCSV = (expenses) => {
    const csvContent = exportToCSV(expenses);
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    downloadFile(csvContent, `expenses_${timestamp}.csv`);
};

// Export investments only
export const exportInvestmentsCSV = (investments) => {
    const csvContent = exportInvestmentsToCSV(investments);
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    downloadFile(csvContent, `investments_${timestamp}.csv`);
};

// Import from JSON
export const importFromJSON = (jsonString) => {
    try {
        const data = JSON.parse(jsonString);
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: 'Invalid JSON format'
        };
    }
};
