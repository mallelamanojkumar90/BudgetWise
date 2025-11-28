'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/page-header';
import ExpenseForm from '../components/expense-form';
import type { Category } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp, addDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2 } from 'lucide-react';

export default function NewExpensePage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'categories')) : null, 
    [firestore, user]
  );
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  const handleSubmit = (data: { description: string; amount: number; categoryId: string; date: Date }) => {
    if (!user) return;
    
    const newExpense = {
      ...data,
      userId: user.uid,
      date: Timestamp.fromDate(data.date),
    };
    
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'expenses'), newExpense);
    
    router.push('/expenses');
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Add New Expense"
          description="Fill in the details of your new expense."
        />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Add New Expense"
        description="Fill in the details of your new expense."
      />
      <Card>
        <CardContent className="p-6">
          <ExpenseForm categories={categories || []} onSubmit={handleSubmit} onClose={() => router.back()} />
        </CardContent>
      </Card>
    </>
  );
}
