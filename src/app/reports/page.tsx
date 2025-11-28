'use client';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import SpendingOverTimeChart from './components/spending-over-time-chart';
import BudgetAdherenceChart from './components/budget-adherence-chart';
import CategoryBreakdownChart from './components/category-breakdown-chart';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { subDays, startOfToday, endOfToday, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import type { Budget, Category, Expense, BudgetWithSpent } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { DateRangeSelect, type DateRangeKey } from './components/date-range-select';

const getDateRange = (rangeKey: DateRangeKey): { from: Date, to: Date } => {
  const now = new Date();
  switch (rangeKey) {
    case '7d':
      return { from: subDays(now, 6), to: endOfToday() };
    case '30d':
      return { from: subDays(now, 29), to: endOfToday() };
    case 'this-month':
      return { from: startOfMonth(now), to: endOfToday() };
    case 'last-month':
      const lastMonth = subMonths(now, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    case '90d':
      return { from: subDays(now, 89), to: endOfToday() };
    default:
      return { from: subDays(now, 29), to: endOfToday() };
  }
};


export default function ReportsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [dateRangeKey, setDateRangeKey] = useState<DateRangeKey>('30d');
    const dateRange = useMemo(() => getDateRange(dateRangeKey), [dateRangeKey]);

    const categoriesQuery = useMemoFirebase(() =>
        user ? query(collection(firestore, 'users', user.uid, 'categories')) : null,
        [firestore, user]
    );
    const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

    const budgetsQuery = useMemoFirebase(() =>
        user ? query(collection(firestore, 'users', user.uid, 'budgets')) : null,
        [firestore, user]
    );
    const { data: budgets, isLoading: isLoadingBudgets } = useCollection<Budget>(budgetsQuery);

    const expensesQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'users', user.uid, 'expenses'),
            where('date', '>=', Timestamp.fromDate(dateRange.from)),
            where('date', '<=', Timestamp.fromDate(dateRange.to))
        );
    }, [firestore, user, dateRange]);
    const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesQuery);
    
    const budgetsWithSpent: BudgetWithSpent[] = useMemo(() => {
        if (!budgets || !expenses || !categories) return [];
        
        // Note: This logic assumes budgets are monthly. If date range spans multiple months,
        // this might not be perfectly accurate without more complex logic.
        // For now, it compares current period expenses to monthly budget.
        const expensesByCategory = (expenses || []).reduce((acc, expense) => {
            acc[expense.categoryId] = (acc[expense.categoryId] || 0) + expense.amount;
            return acc;
        }, {} as { [key: string]: number });

        return budgets.map(budget => ({
            ...budget,
            spentAmount: expensesByCategory[budget.categoryId] || 0,
            categoryName: categories.find(c => c.id === budget.categoryId)?.name || 'Unknown',
            period: 'monthly',
        }));
    }, [budgets, expenses, categories]);

    const isLoading = isLoadingCategories || isLoadingBudgets || isLoadingExpenses;

    if (isLoading) {
        return (
            <>
            <PageHeader
                title="Reports"
                description="Visualize your spending habits and budget adherence."
                actions={<DateRangeSelect value={dateRangeKey} onValueChange={setDateRangeKey} />}
            />
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            </>
        )
    }

  return (
    <>
      <PageHeader 
        title="Reports"
        description="Visualize your spending habits and budget adherence."
        actions={<DateRangeSelect value={dateRangeKey} onValueChange={setDateRangeKey} />}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingOverTimeChart expenses={expenses || []} dateRange={dateRange} />
        <BudgetAdherenceChart budgets={budgetsWithSpent} categories={categories || []} />
      </div>
      <div className="mt-6">
        <CategoryBreakdownChart expenses={expenses || []} categories={categories || []} />
      </div>
    </>
  );
}
