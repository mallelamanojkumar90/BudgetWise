"use client";

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import ExpenseForm from '../components/expense-form';
import { mockCategories, mockExpenses } from '@/lib/data';
import type { Expense } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function NewExpensePage() {
  const router = useRouter();

  const handleSubmit = (data: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      id: `exp${Date.now()}`,
      ...data,
    };
    
    // In a real app, this would be an API call.
    // Here we're just adding to the mock data array.
    mockExpenses.unshift(newExpense); 
    
    // Redirect to the expenses page to see the new entry
    router.push('/expenses');
  };

  return (
    <>
      <PageHeader
        title="Add New Expense"
        description="Fill in the details of your new expense."
      />
      <Card>
        <CardContent className="p-6">
          <ExpenseForm categories={mockCategories} onSubmit={handleSubmit} onClose={() => router.back()} />
        </CardContent>
      </Card>
    </>
  );
}
