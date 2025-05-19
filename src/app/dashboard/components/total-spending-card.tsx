import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { mockExpenses } from '@/lib/data'; // For demo purposes

export default function TotalSpendingCard() {
  // Calculate total spending (mock)
  const totalSpending = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const previousMonthSpending = 1350.75; // Mock data
  const percentageChange = ((totalSpending - previousMonthSpending) / previousMonthSpending) * 100;
  const isIncrease = percentageChange > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Spending (This Month)</CardTitle>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">${totalSpending.toFixed(2)}</div>
        <p className={`text-xs mt-1 ${isIncrease ? 'text-red-500' : 'text-green-500'} flex items-center`}>
          {isIncrease ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
          {Math.abs(percentageChange).toFixed(2)}% from last month
        </p>
      </CardContent>
      <CardFooter>
        <CardDescription>Based on all recorded expenses.</CardDescription>
      </CardFooter>
    </Card>
  );
}
