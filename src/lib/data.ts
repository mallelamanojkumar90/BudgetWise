// This file is no longer used for providing data to the application,
// but it is kept to prevent breaking imports in files that have not yet been migrated.
// In a real-world scenario, this file would be deleted once all components
// are fetching data from Firestore.

import type { Category, Expense, BudgetWithSpent } from './types';

export const mockCategories: Category[] = [];
export const mockExpenses: any[] = [];
export const mockBudgets: BudgetWithSpent[] = [];
