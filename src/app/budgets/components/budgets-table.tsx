"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Budget, Category } from '@/lib/types';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { BudgetFormDialog } from './budget-form-dialog';

interface BudgetsTableProps {
  budgets: Budget[];
  categories: Category[];
}

export default function BudgetsTable({ budgets: initialBudgets, categories }: BudgetsTableProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const handleDelete = (budgetId: string) => {
    setBudgets(prev => prev.filter(b => b.id !== budgetId));
  };
  
  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleFormSubmit = (updatedBudget: Budget) => {
     setBudgets(prev => {
      const index = prev.findIndex(b => b.id === updatedBudget.id);
      if (index > -1) {
        const newBudgets = [...prev];
        newBudgets[index] = {...updatedBudget, categoryName: getCategoryInfo(updatedBudget.categoryId)?.name};
        return newBudgets;
      }
      return [{...updatedBudget, categoryName: getCategoryInfo(updatedBudget.categoryId)?.name}, ...prev];
    });
    setEditingBudget(null);
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
       {editingBudget && (
        <BudgetFormDialog
          categories={categories}
          budget={editingBudget}
          open={!!editingBudget}
          onOpenChange={(isOpen) => !isOpen && setEditingBudget(null)}
          onFormSubmit={handleFormSubmit}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Budgeted</TableHead>
            <TableHead className="text-right">Spent</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.length > 0 ? budgets.map((budget) => {
            const category = getCategoryInfo(budget.categoryId);
            const remaining = budget.amount - budget.spentAmount;
            const progress = budget.amount > 0 ? (budget.spentAmount / budget.amount) * 100 : 0;
            return (
              <TableRow key={budget.id}>
                <TableCell className="font-medium flex items-center">
                  {category && <category.icon className="h-4 w-4 mr-2 text-muted-foreground" />}
                  {category?.name || 'Unknown Category'}
                </TableCell>
                <TableCell className="text-right">${budget.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">${budget.spentAmount.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${remaining.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-[80px] h-2" indicatorClassName={progress > 100 ? "bg-red-500" : ""} />
                    <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(budget)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(budget.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          }) : (
             <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No budgets found. Create your first budget!
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
