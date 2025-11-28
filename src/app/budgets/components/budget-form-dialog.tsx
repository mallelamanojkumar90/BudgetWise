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
} from "@/components/ui/dialog";
import BudgetForm from "./budget-form";
import type { Category, Budget } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

interface BudgetFormDialogProps {
  categories: Category[];
  budget?: Budget | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFormSubmit?: (budget: Omit<Budget, 'spentAmount' | 'period'>) => void;
}

export function BudgetFormDialog({ 
  categories, 
  budget,
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onFormSubmit
 }: BudgetFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleSubmit = (data: { categoryId: string, amount: number }) => {
    const newOrUpdatedBudget: Omit<Budget, 'spentAmount' | 'period'> = {
      id: budget?.id || `bud${Date.now()}`,
      categoryId: data.categoryId,
      amount: data.amount,
      categoryName: categories.find(c => c.id === data.categoryId)?.name,
    };

    if(onFormSubmit) {
      onFormSubmit(newOrUpdatedBudget as Budget);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!budget && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Set New Budget
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget" : "Set New Budget Goal"}</DialogTitle>
          <DialogDescription>
            {budget ? "Update the details for this budget." : "Define a new monthly budget for a category."}
          </DialogDescription>
        </DialogHeader>
        <BudgetForm categories={categories} budget={budget} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
