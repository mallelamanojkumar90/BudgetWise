"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import ExpenseForm from "./expense-form";
import type { Category, Expense } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { mockExpenses } from '@/lib/data'; // For mock data manipulation demo

interface ExpenseFormDialogProps {
  categories: Category[];
  expense?: Expense | null; // For editing
  open?: boolean; // To control dialog visibility from parent
  onOpenChange?: (open: boolean) => void; // To update parent state
  onFormSubmit?: (expense: Expense) => void; // Callback after form submission
}

export function ExpenseFormDialog({ 
  categories, 
  expense, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onFormSubmit 
}: ExpenseFormDialogProps) {
  // If 'open' prop is not provided, dialog manages its own state
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  // Effect to handle controlled 'open' prop changes
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);


  const handleSubmit = (data: any) => {
    // This is where you would typically handle form submission, e.g., API call
    // For mock data, we can update a local state or call a prop function
    const newOrUpdatedExpense: Expense = {
      id: expense?.id || `exp${Date.now()}`, // Generate new ID if not editing
      ...data,
    };
    console.log("Submitting expense:", newOrUpdatedExpense);

    // Example: adding to mockExpenses (this won't persist or re-render table unless table state is managed)
    if (!expense) {
      mockExpenses.push(newOrUpdatedExpense);
    } else {
      const index = mockExpenses.findIndex(e => e.id === expense.id);
      if (index !== -1) mockExpenses[index] = newOrUpdatedExpense;
    }
    
    if (onFormSubmit) {
      onFormSubmit(newOrUpdatedExpense);
    }
    setIsOpen(false); // Close dialog on submit
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!expense && ( // Only show trigger if not in edit mode (dialog opened programmatically)
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
          <DialogDescription>
            {expense ? "Update the details of your expense." : "Fill in the details of your new expense."}
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm categories={categories} expense={expense} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
