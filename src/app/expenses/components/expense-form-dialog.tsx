'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExpenseForm from "./expense-form";
import type { Category } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

interface ExpenseFormDialogProps {
  categories: Category[];
  expense?: { description: string; amount: number; categoryId: string; date: Date } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFormSubmit: (data: { description: string; amount: number; categoryId: string; date: Date }) => void;
}

export function ExpenseFormDialog({ 
  categories, 
  expense, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onFormSubmit 
}: ExpenseFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleSubmit = (data: { description: string; amount: number; categoryId: string; date: Date }) => {
    onFormSubmit(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!expense && (
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
