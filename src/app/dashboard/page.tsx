import PageHeader from '@/components/page-header';
import TotalSpendingCard from './components/total-spending-card';
import BudgetStatusOverview from './components/budget-status-overview';
import SpendingByCategoryChart from './components/spending-by-category-chart';
import RecentTransactionsTable from './components/recent-transactions-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's a summary of your finances."
        actions={
          <Link href="/expenses/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </Link>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TotalSpendingCard />
        <BudgetStatusOverview />
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <SpendingByCategoryChart />
        <RecentTransactionsTable />
      </div>
    </>
  );
}
