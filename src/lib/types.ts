import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  iconName: string; // Changed from icon: LucideIcon
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: Date;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName?: string; // For display purposes
  amount: number;
  spentAmount: number; // This would typically be calculated
  period: 'monthly'; // Assuming monthly budgets for simplicity
}

// For chart data
export interface ChartDataEntry {
  name: string;
  value: number;
  fill?: string; // For individual segment colors in charts
}
