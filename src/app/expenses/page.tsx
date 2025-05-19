import PageHeader from '@/components/page-header';
import ExpensesTable from './components/expenses-table';
import { ExpenseFormDialog } from './components/expense-form-dialog'; // Wrapper for dialog
import { mockCategories, mockExpenses } from '@/lib/data'; // For passing to components

export default function ExpensesPage() {
  // In a real app, data would be fetched here or managed via context/state library
  // For now, components might use mock data directly or receive it as props

  return (
    <>
      <PageHeader 
        title="Expenses"
        description="Track and manage your spending."
        actions={<ExpenseFormDialog categories={mockCategories} />}
      />
      <ExpensesTable expenses={mockExpenses} categories={mockCategories} />
    </>
  );
}
