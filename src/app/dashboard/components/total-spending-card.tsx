import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import type { Expense } from '@/lib/types';

interface TotalSpendingCardProps {
    currentMonthExpenses: Expense[];
    previousMonthExpenses: Expense[];
}

export default function TotalSpendingCard({ currentMonthExpenses, previousMonthExpenses }: TotalSpendingCardProps) {
  const totalSpending = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const previousMonthSpending = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const percentageChange = previousMonthSpending > 0 
    ? ((totalSpending - previousMonthSpending) / previousMonthSpending) * 100 
    : totalSpending > 0 ? 100 : 0;
  
  const isIncrease = percentageChange > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Spending (This Month)</CardTitle>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">${totalSpending.toFixed(2)}</div>
        {previousMonthSpending > 0 && (
            <p className={`text-xs mt-1 ${isIncrease ? 'text-red-500' : 'text-green-500'} flex items-center`}>
            {isIncrease ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
            {Math.abs(percentageChange).toFixed(2)}% from last month
            </p>
        )}
      </CardContent>
      <CardFooter>
        <CardDescription>Based on all recorded expenses.</CardDescription>
      </CardFooter>
    </Card>
  );
}
