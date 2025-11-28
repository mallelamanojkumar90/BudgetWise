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
import CategoryForm from "./category-form";
import type { Category } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';


interface CategoryFormDialogProps {
  category?: Category | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFormSubmit?: (category: Category) => void;
}

export function CategoryFormDialog({ 
  category, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onFormSubmit
}: CategoryFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleSubmit = (data: { name: string; icon: keyof typeof LucideIcons }) => {
    // data.icon is the icon name (string)
    const newOrUpdatedCategory: Category = {
      id: category?.id || `cat${Date.now()}`,
      name: data.name,
      iconName: data.icon, // Store the icon name string
    };
    
    if (onFormSubmit) {
      onFormSubmit(newOrUpdatedCategory);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!category && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the details of this category." : "Create a new spending category."}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
