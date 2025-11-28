'use client';

import { useMemo } from 'react';
import PageHeader from '@/components/page-header';
import ExpensesTable from './components/expenses-table';
import { ExpenseFormDialog } from './components/expense-form-dialog';
import type { Expense, Category } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2 } from 'lucide-react';

export default function ExpensesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'categories')) : null, 
    [firestore, user]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const expensesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'expenses'), orderBy('date', 'desc')) : null, 
    [firestore, user]
  );
  const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesQuery);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'userId' | 'date'> & { date: Date }) => {
    if (!user) return;
    const expenseWithUser: Omit<Expense, 'id'> = {
      ...newExpenseData,
      userId: user.uid,
      date: Timestamp.fromDate(newExpenseData.date),
    };
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'expenses'), expenseWithUser);
  };
  
  const handleUpdateExpense = (updatedExpense: Omit<Expense, 'userId' | 'date'> & { date: Date }) => {
     if (!user) return;
     const docRef = doc(firestore, 'users', user.uid, 'expenses', updatedExpense.id);
     const dataToUpdate = {
        ...updatedExpense,
        date: Timestamp.fromDate(updatedExpense.date)
     };
     updateDocumentNonBlocking(docRef, dataToUpdate);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!user) return;
    const docRef = doc(firestore, 'users', user.uid, 'expenses', expenseId);
    deleteDocumentNonBlocking(docRef);
  };
  
  const isLoading = isLoadingCategories || isLoadingExpenses;

  return (
    <>
      <PageHeader 
        title="Expenses"
        description="Track and manage your spending."
        actions={categories && <ExpenseFormDialog categories={categories} onFormSubmit={handleAddExpense} />}
      />
      {isLoading ? (
         <div className="flex justify-center items-center h-64">
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         </div>
      ) : (
        <ExpensesTable 
          expenses={expenses || []} 
          categories={categories || []} 
          onUpdate={handleUpdateExpense}
          onDelete={handleDeleteExpense}
        />
      )}
    </>
  );
}
