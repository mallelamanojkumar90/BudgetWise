"use client";

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import BudgetsTable from './components/budgets-table';
import { BudgetFormDialog } from './components/budget-form-dialog';
import { mockBudgets, mockCategories } from '@/lib/data';
import type { Budget } from '@/lib/types';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);

  const handleFormSubmit = (newOrUpdatedBudget: Budget) => {
    setBudgets(prevBudgets => {
      const index = prevBudgets.findIndex(b => b.id === newOrUpdatedBudget.id);
      const category = mockCategories.find(c => c.id === newOrUpdatedBudget.categoryId);
      
      if (index > -1) {
        // Update existing budget
        const newBudgets = [...prevBudgets];
        // Make sure to preserve the spentAmount
        const existingSpentAmount = newBudgets[index].spentAmount;
        newBudgets[index] = { 
          ...newOrUpdatedBudget, 
          categoryName: category?.name,
          spentAmount: existingSpentAmount, // Preserve spent amount on edit
          period: 'monthly'
        };
        return newBudgets;
      } else {
        // Add new budget with initialized spentAmount
        const budgetWithDefaults = { 
          ...newOrUpdatedBudget, 
          categoryName: category?.name,
          spentAmount: 0, 
          period: 'monthly' as const
        };
        return [budgetWithDefaults, ...prevBudgets];
      }
    });
  };

  const handleBudgetsChange = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets);
  };

  return (
    <>
      <PageHeader 
        title="Budgets"
        description="Set and track your monthly budget goals."
        actions={<BudgetFormDialog categories={mockCategories} onFormSubmit={handleFormSubmit} />}
      />
      <BudgetsTable budgets={budgets} categories={mockCategories} onBudgetsChange={handleBudgetsChange} />
    </>
  );
}
