"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Expense, Category } from '@/lib/types';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ExpenseFormDialog } from './expense-form-dialog'; // For editing

interface ExpensesTableProps {
  expenses: Expense[];
  categories: Category[];
  onExpensesChange?: (expenses: Expense[]) => void;
}

export default function ExpensesTable({ expenses, categories, onExpensesChange }: ExpensesTableProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const handleDelete = (expenseId: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
    if (onExpensesChange) {
      onExpensesChange(updatedExpenses);
    }
  };
  
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleFormSubmit = (updatedExpense: Expense) => {
    const index = expenses.findIndex(exp => exp.id === updatedExpense.id);
    let newExpenses;
    if (index > -1) {
      newExpenses = [...expenses];
      newExpenses[index] = updatedExpense;
    } else {
      // This case is for adding, but parent now handles it.
      // We will just update if found for edits.
      newExpenses = [updatedExpense, ...expenses];
    }
    if (onExpensesChange) {
      onExpensesChange(newExpenses);
    }
    setEditingExpense(null); // Close dialog
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      {editingExpense && (
        <ExpenseFormDialog
          categories={categories}
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(isOpen) => !isOpen && setEditingExpense(null)}
          onFormSubmit={handleFormSubmit}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell>
                <Badge variant="outline">{getCategoryName(expense.categoryId)}</Badge>
              </TableCell>
              <TableCell>{format(expense.date, 'MMM dd, yyyy')}</TableCell>
              <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleEdit(expense)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(expense.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
             <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No expenses found. Add your first expense!
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
