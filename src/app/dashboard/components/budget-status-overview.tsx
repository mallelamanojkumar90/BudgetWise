import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockBudgets } from '@/lib/data'; // For demo purposes
import { Goal } from "lucide-react";

export default function BudgetStatusOverview() {
  // Calculate overall budget status (mock)
  const totalBudgeted = mockBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = mockBudgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const progressPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Overall Budget Status</CardTitle>
        <Goal className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">${totalSpent.toFixed(2)} <span className="text-lg text-muted-foreground">spent of ${totalBudgeted.toFixed(2)}</span></div>
        <Progress value={progressPercentage} className="mt-2 h-3" />
         <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{progressPercentage.toFixed(0)}% Utilized</span>
          <span>${(totalBudgeted - totalSpent).toFixed(2)} Remaining</span>
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription>Across all budget categories.</CardDescription>
      </CardFooter>
    </Card>
  );
}
