'use client';
import { useMemo } from 'react';
import PageHeader from '@/components/page-header';
import TotalSpendingCard from './components/total-spending-card';
import BudgetStatusOverview from './components/budget-status-overview';
import SpendingByCategoryChart from './components/spending-by-category-chart';
import RecentTransactionsTable from './components/recent-transactions-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import type { Budget, Category, Expense, BudgetWithSpent } from '@/lib/types';


export default function DashboardPage() {
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

    const recentExpensesQuery = useMemoFirebase(() =>
        user ? query(collection(firestore, 'users', user.uid, 'expenses'), orderBy('date', 'desc'), limit(5)) : null,
        [firestore, user]
    );
    const { data: recentExpenses, isLoading: isLoadingRecentExpenses } = useCollection<Expense>(recentExpensesQuery);

    const currentMonthExpensesQuery = useMemoFirebase(() => {
        if (!user) return null;
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        return query(
            collection(firestore, 'users', user.uid, 'expenses'),
            where('date', '>=', Timestamp.fromDate(start)),
            where('date', '<=', Timestamp.fromDate(end))
        );
    }, [firestore, user]);
    const { data: currentMonthExpenses, isLoading: isLoadingCurrentMonthExpenses } = useCollection<Expense>(currentMonthExpensesQuery);
    
    const previousMonthExpensesQuery = useMemoFirebase(() => {
        if (!user) return null;
        const now = new Date();
        const prevMonthStartDate = startOfMonth(subMonths(now, 1));
        const prevMonthEndDate = endOfMonth(subMonths(now, 1));
        return query(
            collection(firestore, 'users', user.uid, 'expenses'),
            where('date', '>=', Timestamp.fromDate(prevMonthStartDate)),
            where('date', '<=', Timestamp.fromDate(prevMonthEndDate))
        );
    }, [user, firestore]);
    const { data: previousMonthExpenses, isLoading: isLoadingPrevMonthExpenses } = useCollection<Expense>(previousMonthExpensesQuery);


    const budgetsWithSpent: BudgetWithSpent[] = useMemo(() => {
        if (!budgets || !currentMonthExpenses || !categories) return [];
        const expensesByCategory = (currentMonthExpenses || []).reduce((acc, expense) => {
            acc[expense.categoryId] = (acc[expense.categoryId] || 0) + expense.amount;
            return acc;
        }, {} as { [key: string]: number });

        return budgets.map(budget => ({
            ...budget,
            spentAmount: expensesByCategory[budget.categoryId] || 0,
            categoryName: categories.find(c => c.id === budget.categoryId)?.name || 'Unknown',
            period: 'monthly',
        }));
    }, [budgets, currentMonthExpenses, categories]);
    
    const isLoading = isLoadingCategories || isLoadingBudgets || isLoadingRecentExpenses || isLoadingCurrentMonthExpenses || isLoadingPrevMonthExpenses;

    if (isLoading) {
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's a summary of your finances."
        actions={
          <Link href="/expenses/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </Link>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TotalSpendingCard currentMonthExpenses={currentMonthExpenses || []} previousMonthExpenses={previousMonthExpenses || []} />
        <BudgetStatusOverview budgets={budgetsWithSpent} />
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <SpendingByCategoryChart expenses={currentMonthExpenses || []} categories={categories || []} />
        <RecentTransactionsTable expenses={recentExpenses || []} categories={categories || []} />
      </div>
    </>
  );
}
