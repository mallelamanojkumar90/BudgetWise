import PageHeader from '@/components/page-header';
import BudgetsTable from './components/budgets-table';
import { BudgetFormDialog } from './components/budget-form-dialog';
import { mockBudgets, mockCategories } from '@/lib/data';

export default function BudgetsPage() {
  return (
    <>
      <PageHeader 
        title="Budgets"
        description="Set and track your monthly budget goals."
        actions={<BudgetFormDialog categories={mockCategories} />}
      />
      <BudgetsTable budgets={mockBudgets} categories={mockCategories} />
    </>
  );
}
