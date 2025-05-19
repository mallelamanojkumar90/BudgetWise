import PageHeader from '@/components/page-header';
import SpendingOverTimeChart from './components/spending-over-time-chart';
import BudgetAdherenceChart from './components/budget-adherence-chart';
import CategoryBreakdownChart from './components/category-breakdown-chart'; // Similar to dashboard one but could be more detailed

export default function ReportsPage() {
  return (
    <>
      <PageHeader 
        title="Reports"
        description="Visualize your spending habits and budget adherence."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingOverTimeChart />
        <BudgetAdherenceChart />
      </div>
      <div className="mt-6">
        <CategoryBreakdownChart />
      </div>
    </>
  );
}
