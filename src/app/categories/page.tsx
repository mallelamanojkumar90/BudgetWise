import PageHeader from '@/components/page-header';
import CategoriesTable from './components/categories-table';
import { CategoryFormDialog } from './components/category-form-dialog';
import { mockCategories } from '@/lib/data';

export default function CategoriesPage() {
  return (
    <>
      <PageHeader 
        title="Categories"
        description="Manage your spending categories."
        actions={<CategoryFormDialog />}
      />
      <CategoriesTable categories={mockCategories} />
    </>
  );
}
