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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from '@/lib/types';
import * as LucideIcons from 'lucide-react'; // Import all icons

const iconNames = Object.keys(LucideIcons).filter(key => key !== 'createReactComponent' && key !== 'createLucideIcon' && key !== 'icons' && typeof LucideIcons[key as keyof typeof LucideIcons] === 'object') as (keyof typeof LucideIcons)[];

const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }).max(50, { message: "Category name must be at most 50 characters." }),
  icon: z.enum(iconNames, { required_error: "Please select an icon." }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: CategoryFormValues) => void;
  onClose?: () => void;
}

export default function CategoryForm({ category, onSubmit, onClose }: CategoryFormProps) {
  const defaultIconName = category ? category.iconName : 'Tag';
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category ? {
      name: category.name,
      icon: (iconNames.includes(category.iconName as keyof typeof LucideIcons) ? category.iconName : 'Tag') as keyof typeof LucideIcons,
    } : {
      name: "",
      icon: "Tag" as keyof typeof LucideIcons,
    },
  });

  const handleSubmit = (data: CategoryFormValues) => {
    onSubmit(data);
    if (onClose) onClose();
    if (!category) form.reset();
  };
  
  const selectedIconName = form.watch("icon");
  const SelectedIconComponent = LucideIcons[selectedIconName as keyof typeof LucideIcons] || LucideIcons.Tag;


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <div className="flex items-center gap-2">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60">
                    {iconNames.map((iconName) => {
                      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
                      if (typeof IconComponent !== 'function' && typeof IconComponent !== 'object') return null; // Skip non-component exports (like default)
                      const ActualIcon = typeof IconComponent === 'function' ? IconComponent : LucideIcons.Tag; // Lucide icons are objects with render function
                      return (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            <ActualIcon className="h-4 w-4" />
                            {iconName}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {SelectedIconComponent && <SelectedIconComponent className="h-8 w-8 p-1 border rounded-md text-muted-foreground" />}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
          {onClose && <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>}
          <Button type="submit">{category ? "Save Changes" : "Create Category"}</Button>
        </div>
      </form>
    </Form>
  );
}
