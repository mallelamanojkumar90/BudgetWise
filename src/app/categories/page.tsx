'use client';

import { useMemo } from 'react';
import PageHeader from '@/components/page-header';
import CategoriesTable from './components/categories-table';
import { CategoryFormDialog } from './components/category-form-dialog';
import type { Category } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'categories')) : null, 
    [firestore, user]
  );
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  const handleFormSubmit = (data: Omit<Category, 'id' | 'userId'>) => {
    if (!user) return;
    const newCategory = { ...data, userId: user.uid };
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'categories'), newCategory);
  };
  
  const handleUpdate = (category: Omit<Category, 'userId'>) => {
     if (!user) return;
     const docRef = doc(firestore, 'users', user.uid, 'categories', category.id);
     updateDocumentNonBlocking(docRef, category);
  }
  
  const handleDelete = (categoryId: string) => {
      if(!user) return;
      const docRef = doc(firestore, 'users', user.uid, 'categories', categoryId);
      deleteDocumentNonBlocking(docRef);
  }

  return (
    <>
      <PageHeader 
        title="Categories"
        description="Manage your spending categories."
        actions={<CategoryFormDialog onFormSubmit={handleFormSubmit} />}
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CategoriesTable categories={categories || []} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}
    </>
  );
}
