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
}

export default function ExpensesTable({ expenses: initialExpenses, categories }: ExpensesTableProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const handleDelete = (expenseId: string) => {
    // Mock delete: filter out the expense
    setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== expenseId));
    // In a real app, this would be an API call / server action
  };
  
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleFormSubmit = (updatedExpense: Expense) => {
    // Mock update: replace or add the expense
    setExpenses(prevExpenses => {
      const index = prevExpenses.findIndex(exp => exp.id === updatedExpense.id);
      if (index > -1) {
        const newExpenses = [...prevExpenses];
        newExpenses[index] = updatedExpense;
        return newExpenses;
      }
      // This form is typically for new expenses, but we're reusing for edit dialog state mgmt here
      // A real app would handle add/edit separately or use a more robust state solution.
      return [updatedExpense, ...prevExpenses]; 
    });
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
          onFormSubmit={handleFormSubmit} // This needs to be passed to the actual form inside dialog
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
