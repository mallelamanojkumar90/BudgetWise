'use client';

import { useMemo } from 'react';
import PageHeader from '@/components/page-header';
import BudgetsTable from './components/budgets-table';
import { BudgetFormDialog } from './components/budget-form-dialog';
import type { Budget, Category, Expense, BudgetWithSpent } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2 } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function BudgetsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Fetch categories
  const categoriesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'categories')) : null, 
    [firestore, user]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  // Fetch budgets
  const budgetsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'budgets')) : null, 
    [firestore, user]
  );
  const { data: budgets, isLoading: isLoadingBudgets } = useCollection<Budget>(budgetsQuery);

  // Fetch expenses for the current month to calculate spent amounts
  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null;
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return query(
      collection(firestore, 'users', user.uid, 'expenses'),
      where('date', '>=', start),
      where('date', '<=', end)
    );
  }, [firestore, user]);
  const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesQuery);

  // Combine budgets with calculated spent amounts
  const budgetsWithSpent: BudgetWithSpent[] = useMemo(() => {
    if (!budgets || !expenses || !categories) return [];
    
    const expensesByCategory = expenses.reduce((acc, expense) => {
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

  const handleFormSubmit = (data: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;
    const newBudget = { ...data, userId: user.uid };
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'budgets'), newBudget);
  };
  
  const handleUpdate = (budget: Omit<Budget, 'userId'>) => {
     if (!user) return;
     const docRef = doc(firestore, 'users', user.uid, 'budgets', budget.id);
     const { id, ...dataToUpdate } = budget;
     updateDocumentNonBlocking(docRef, dataToUpdate);
  }
  
  const handleDelete = (budgetId: string) => {
      if(!user) return;
      const docRef = doc(firestore, 'users', user.uid, 'budgets', budgetId);
      deleteDocumentNonBlocking(docRef);
  }

  const isLoading = isLoadingCategories || isLoadingBudgets || isLoadingExpenses;

  // Filter out categories that already have a budget
  const availableCategories = useMemo(() => {
    if (!categories || !budgets) return [];
    const budgetedCategoryIds = new Set(budgets.map(b => b.categoryId));
    return categories.filter(c => !budgetedCategoryIds.has(c.id));
  }, [categories, budgets]);

  return (
    <>
      <PageHeader 
        title="Budgets"
        description="Set and track your monthly budget goals."
        actions={!isLoading && <BudgetFormDialog categories={availableCategories} onFormSubmit={handleFormSubmit} />}
      />
      {isLoading ? (
         <div className="flex justify-center items-center h-64">
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         </div>
      ) : (
        <BudgetsTable 
          budgets={budgetsWithSpent} 
          categories={categories || []} 
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
