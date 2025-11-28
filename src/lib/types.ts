import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Expense {
  id:string;
  description: string;
  amount: number;
  categoryId: string;
  date: Timestamp;
  userId: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName?: string; 
  amount: number;
  userId: string;
}

// This type is calculated on the client, not stored in Firestore
export interface BudgetWithSpent extends Budget {
    spentAmount: number;
    period: 'monthly';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'budget_warning' | 'report_ready' | 'system';
  read: boolean;
  createdAt: Timestamp;
  link?: string;
}


// For chart data
export interface ChartDataEntry {
  name: string;
  value: number;
  fill?: string; // For individual segment colors in charts
}

    