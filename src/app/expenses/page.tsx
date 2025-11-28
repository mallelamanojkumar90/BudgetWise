"use client";

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import ExpensesTable from './components/expenses-table';
import { ExpenseFormDialog } from './components/expense-form-dialog';
import { mockCategories, mockExpenses } from '@/lib/data';
import type { Expense } from '@/lib/types';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prevExpenses => [newExpense, ...prevExpenses].sort((a, b) => b.date.getTime() - a.date.getTime()));
  };
  
  const handleUpdateExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses.sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  return (
    <>
      <PageHeader 
        title="Expenses"
        description="Track and manage your spending."
        actions={<ExpenseFormDialog categories={mockCategories} onFormSubmit={handleAddExpense} />}
      />
      <ExpensesTable expenses={expenses} categories={mockCategories} onExpensesChange={handleUpdateExpenses} />
    </>
  );
}
