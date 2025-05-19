import type { Category, Expense, Budget } from './types';
import { ShoppingCart, Utensils, Home, Car, Heart, Tag, Plane, Shirt, Film, Gift } from 'lucide-react';

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Groceries', icon: ShoppingCart },
  { id: 'cat2', name: 'Dining Out', icon: Utensils },
  { id: 'cat3', name: 'Housing', icon: Home },
  { id: 'cat4', name: 'Transportation', icon: Car },
  { id: 'cat5', name: 'Health', icon: Heart },
  { id: 'cat6', name: 'Travel', icon: Plane },
  { id: 'cat7', name: 'Clothing', icon: Shirt },
  { id: 'cat8', name: 'Entertainment', icon: Film },
  { id: 'cat9', name: 'Gifts', icon: Gift },
  { id: 'cat10', name: 'Other', icon: Tag },
];

export const mockExpenses: Expense[] = [
  { id: 'exp1', description: 'Weekly groceries', amount: 75.50, categoryId: 'cat1', date: new Date(2024, 6, 1) },
  { id: 'exp2', description: 'Lunch with friends', amount: 30.00, categoryId: 'cat2', date: new Date(2024, 6, 2) },
  { id: 'exp3', description: 'Rent payment', amount: 1200.00, categoryId: 'cat3', date: new Date(2024, 6, 1) },
  { id: 'exp4', description: 'Gas fill-up', amount: 50.25, categoryId: 'cat4', date: new Date(2024, 6, 3) },
  { id: 'exp5', description: 'Movie tickets', amount: 25.00, categoryId: 'cat8', date: new Date(2024, 6, 5) },
  { id: 'exp6', description: 'Dinner date', amount: 60.00, categoryId: 'cat2', date: new Date(2024, 6, 8) },
  { id: 'exp7', description: 'New T-shirt', amount: 22.99, categoryId: 'cat7', date: new Date(2024, 6, 10) },
  { id: 'exp8', description: 'Pharmacy bill', amount: 15.75, categoryId: 'cat5', date: new Date(2024, 6, 12) },
];

export const mockBudgets: Budget[] = [
  { id: 'bud1', categoryId: 'cat1', categoryName: 'Groceries', amount: 300, spentAmount: 75.50, period: 'monthly' },
  { id: 'bud2', categoryId: 'cat2', categoryName: 'Dining Out', amount: 150, spentAmount: 90.00, period: 'monthly' },
  { id: 'bud3', categoryId: 'cat3', categoryName: 'Housing', amount: 1200, spentAmount: 1200.00, period: 'monthly' },
  { id: 'bud4', categoryId: 'cat4', categoryName: 'Transportation', amount: 100, spentAmount: 50.25, period: 'monthly' },
  { id: 'bud5', categoryId: 'cat8', categoryName: 'Entertainment', amount: 80, spentAmount: 25.00, period: 'monthly' },
];
