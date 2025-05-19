"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category, Budget } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

const budgetFormSchema = z.object({
  categoryId: z.string().min(1, { message: "Please select a category." }),
  amount: z.coerce.number().positive({ message: "Budget amount must be positive." }),
  // period is fixed to 'monthly' for now
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  categories: Category[];
  budget?: Budget | null;
  onSubmit: (data: BudgetFormValues) => void;
  onClose?: () => void;
}

export default function BudgetForm({ categories, budget, onSubmit, onClose }: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: budget ? {
      categoryId: budget.categoryId,
      amount: Number(budget.amount),
    } : {
      categoryId: "",
      amount: undefined,
    },
  });

  const handleSubmit = (data: BudgetFormValues) => {
    onSubmit(data);
    if (onClose) onClose();
    if (!budget) form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!budget}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for this budget" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => {
                    const IconComponent = LucideIcons[category.iconName as keyof typeof LucideIcons] || LucideIcons.Tag;
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                          {category.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Budget Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
           {onClose && <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>}
          <Button type="submit">{budget ? "Save Changes" : "Set Budget"}</Button>
        </div>
      </form>
    </Form>
  );
}
