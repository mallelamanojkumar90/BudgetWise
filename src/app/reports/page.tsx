'use client';
import { useMemo } from 'react';
import PageHeader from '@/components/page-header';
import SpendingOverTimeChart from './components/spending-over-time-chart';
import BudgetAdherenceChart from './components/budget-adherence-chart';
import CategoryBreakdownChart from './components/category-breakdown-chart';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { startOfMonth, endOfMonth, subDays } from 'date-fns';
import type { Budget, Category, Expense, BudgetWithSpent } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ReportsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

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

    const thirtyDaysExpensesQuery = useMemoFirebase(() => {
        if (!user) return null;
        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        return query(
            collection(firestore, 'users', user.uid, 'expenses'),
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate))
        );
    }, [firestore, user]);
    const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(thirtyDaysExpensesQuery);
    
    const budgetsWithSpent: BudgetWithSpent[] = useMemo(() => {
        if (!budgets || !expenses || !categories) return [];
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
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingOverTimeChart expenses={expenses || []} />
        <BudgetAdherenceChart budgets={budgetsWithSpent} categories={categories || []} />
      </div>
      <div className="mt-6">
        <CategoryBreakdownChart expenses={expenses || []} categories={categories || []} />
      </div>
    </>
  );
}
