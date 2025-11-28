"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { BudgetWithSpent, Category, Budget } from '@/lib/types';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { BudgetFormDialog } from './budget-form-dialog';
import * as LucideIcons from 'lucide-react';

interface BudgetsTableProps {
  budgets: BudgetWithSpent[];
  categories: Category[];
  onUpdate: (budget: Omit<Budget, 'userId'>) => void;
  onDelete: (budgetId: string) => void;
}

export default function BudgetsTable({ budgets, categories, onUpdate, onDelete }: BudgetsTableProps) {
  const [editingBudget, setEditingBudget] = useState<BudgetWithSpent | null>(null);

  const getCategoryInfo = (categoryId: string): Category | undefined => {
    return categories.find(cat => cat.id === categoryId);
  };

  const handleEdit = (budget: BudgetWithSpent) => {
    setEditingBudget(budget);
  };

  const handleFormSubmit = (data: { categoryId: string, amount: number }) => {
     if (editingBudget) {
       onUpdate({ id: editingBudget.id, ...data });
     }
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
            const IconComponent = category ? LucideIcons[category.iconName as keyof typeof LucideIcons] || LucideIcons.Tag : LucideIcons.Tag;
            const remaining = budget.amount - budget.spentAmount;
            const progress = budget.amount > 0 ? (budget.spentAmount / budget.amount) * 100 : 0;
            return (
              <TableRow key={budget.id}>
                <TableCell className="font-medium flex items-center">
                  {category && <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />}
                  {category?.name || 'Unknown Category'}
                </TableCell>
                <TableCell className="text-right">₹{budget.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">₹{budget.spentAmount.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${remaining < 0 ? 'text-destructive' : 'text-green-500'}`}>
                  ₹{remaining.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-[80px] h-2" indicatorClassName={progress > 100 ? "bg-destructive" : ""} />
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
                      <DropdownMenuItem onClick={() => onDelete(budget.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
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
