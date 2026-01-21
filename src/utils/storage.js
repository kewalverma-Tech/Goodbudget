// LocalStorage helper functions for expense tracker

const STORAGE_KEYS = {
  EXPENSES: 'expense_tracker_expenses',
  INVESTMENTS: 'expense_tracker_investments',
  BUDGETS: 'expense_tracker_budgets',
  SETTINGS: 'expense_tracker_settings'
};

// Expenses
export const saveExpenses = (expenses) => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return true;
  } catch (error) {
    console.error('Error saving expenses:', error);
    return false;
  }
};

export const loadExpenses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

// Investments
export const saveInvestments = (investments) => {
  try {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
    return true;
  } catch (error) {
    console.error('Error saving investments:', error);
    return false;
  }
};

export const loadInvestments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading investments:', error);
    return [];
  }
};

// Budgets
export const saveBudgets = (budgets) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    return true;
  } catch (error) {
    console.error('Error saving budgets:', error);
    return false;
  }
};

export const loadBudgets = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading budgets:', error);
    return {};
  }
};

// Settings
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const loadSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'light' };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { theme: 'light' };
  }
};

// Clear all data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Balance tracking
export const saveBalance = (balance) => {
  try {
    const settings = loadSettings();
    settings.accountBalance = balance;
    saveSettings(settings);
    return true;
  } catch (error) {
    console.error('Error saving balance:', error);
    return false;
  }
};

export const getBalance = () => {
  try {
    const settings = loadSettings();
    return settings.accountBalance || 0;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};
