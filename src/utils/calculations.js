import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, format } from 'date-fns';

// Group expenses by week
export const groupByWeek = (expenses, date = new Date()) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    return expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: weekStart, end: weekEnd });
    });
};

// Group expenses by month
export const groupByMonth = (expenses, date = new Date()) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    return expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
};

// Group expenses by date range
export const filterByDateRange = (expenses, startDate, endDate) => {
    return expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: startDate, end: endDate });
    });
};

// Calculate total for expenses
export const calculateTotal = (expenses) => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
};

// Calculate category totals
export const calculateCategoryTotals = (expenses) => {
    const totals = {};

    expenses.forEach(expense => {
        const category = expense.category || 'Other';
        totals[category] = (totals[category] || 0) + parseFloat(expense.amount || 0);
    });

    return totals;
};

// Calculate budget utilization
export const calculateBudgetUtilization = (expenses, budgets) => {
    const categoryTotals = calculateCategoryTotals(expenses);
    const utilization = {};

    Object.keys(budgets).forEach(category => {
        const spent = categoryTotals[category] || 0;
        const budget = budgets[category] || 0;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;

        utilization[category] = {
            spent,
            budget,
            percentage: Math.min(percentage, 100),
            remaining: Math.max(budget - spent, 0),
            isOverBudget: spent > budget
        };
    });

    return utilization;
};

// Calculate investment ROI
export const calculateROI = (investment) => {
    const initial = parseFloat(investment.amount || 0);
    const current = parseFloat(investment.currentValue || initial);
    const roi = initial > 0 ? ((current - initial) / initial) * 100 : 0;

    return {
        initial,
        current,
        profit: current - initial,
        roi: roi.toFixed(2)
    };
};

// Get top spending categories
export const getTopCategories = (expenses, limit = 5) => {
    const categoryTotals = calculateCategoryTotals(expenses);

    return Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([category, amount]) => ({ category, amount }));
};

// Group expenses by day
export const groupByDay = (expenses) => {
    const grouped = {};

    expenses.forEach(expense => {
        const day = format(parseISO(expense.date), 'yyyy-MM-dd');
        if (!grouped[day]) {
            grouped[day] = [];
        }
        grouped[day].push(expense);
    });

    return grouped;
};

// Calculate weekly trend (last 4 weeks)
export const calculateWeeklyTrend = (expenses) => {
    const weeks = [];
    const today = new Date();

    for (let i = 3; i >= 0; i--) {
        const weekDate = new Date(today);
        weekDate.setDate(today.getDate() - (i * 7));

        const weekExpenses = groupByWeek(expenses, weekDate);
        const total = calculateTotal(weekExpenses);

        weeks.push({
            week: format(startOfWeek(weekDate, { weekStartsOn: 1 }), 'MMM dd'),
            amount: total
        });
    }

    return weeks;
};

// Calculate monthly trend (last 6 months)
export const calculateMonthlyTrend = (expenses) => {
    const months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);

        const monthExpenses = groupByMonth(expenses, monthDate);
        const total = calculateTotal(monthExpenses);

        months.push({
            month: format(monthDate, 'MMM yyyy'),
            amount: total
        });
    }

    return months;
};

// Search expenses
export const searchExpenses = (expenses, query) => {
    const lowerQuery = query.toLowerCase();

    return expenses.filter(expense =>
        expense.category?.toLowerCase().includes(lowerQuery) ||
        expense.notes?.toLowerCase().includes(lowerQuery) ||
        expense.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
};

// Sort expenses
export const sortExpenses = (expenses, sortBy = 'date', order = 'desc') => {
    const sorted = [...expenses];

    sorted.sort((a, b) => {
        let compareA, compareB;

        if (sortBy === 'date') {
            compareA = new Date(a.date);
            compareB = new Date(b.date);
        } else if (sortBy === 'amount') {
            compareA = parseFloat(a.amount);
            compareB = parseFloat(b.amount);
        } else {
            compareA = a[sortBy];
            compareB = b[sortBy];
        }

        if (order === 'asc') {
            return compareA > compareB ? 1 : -1;
        } else {
            return compareA < compareB ? 1 : -1;
        }
    });

    return sorted;
};
