"use client";

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import CategoriesTable from './components/categories-table';
import { CategoryFormDialog } from './components/category-form-dialog';
import { mockCategories } from '@/lib/data';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const handleFormSubmit = (newOrUpdatedCategory: Category) => {
    setCategories(prevCategories => {
      const index = prevCategories.findIndex(c => c.id === newOrUpdatedCategory.id);
      if (index > -1) {
        // Update existing category
        const newCategories = [...prevCategories];
        newCategories[index] = newOrUpdatedCategory;
        return newCategories;
      } else {
        // Add new category
        return [newOrUpdatedCategory, ...prevCategories];
      }
    });
  };

  const handleCategoriesChange = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  return (
    <>
      <PageHeader 
        title="Categories"
        description="Manage your spending categories."
        actions={<CategoryFormDialog onFormSubmit={handleFormSubmit} />}
      />
      <CategoriesTable categories={categories} onCategoriesChange={handleCategoriesChange} />
    </>
  );
}
