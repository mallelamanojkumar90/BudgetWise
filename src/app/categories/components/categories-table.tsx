"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Category } from '@/lib/types';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { CategoryFormDialog } from './category-form-dialog';

interface CategoriesTableProps {
  categories: Category[];
}

export default function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };
  
  const handleFormSubmit = (updatedCategory: Category) => {
    setCategories(prev => {
      const index = prev.findIndex(c => c.id === updatedCategory.id);
      if (index > -1) {
        const newCategories = [...prev];
        newCategories[index] = updatedCategory;
        return newCategories;
      }
      return [updatedCategory, ...prev];
    });
    setEditingCategory(null);
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      {editingCategory && (
        <CategoryFormDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(isOpen) => !isOpen && setEditingCategory(null)}
          onFormSubmit={handleFormSubmit}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell><category.icon className="h-5 w-5 text-muted-foreground" /></TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                No categories found. Add your first category!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
