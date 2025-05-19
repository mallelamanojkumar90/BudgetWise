"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mockBudgets, mockCategories } from '@/lib/data';
import type { ChartConfig } from "@/components/ui/chart";
import { useMemo, useState, useEffect } from "react";

const chartConfig = {
  budgeted: {
    label: "Budgeted",
    color: "hsl(var(--chart-2))", // Use accent or a secondary chart color
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-1))", // Use primary chart color
  },
} satisfies ChartConfig;

export default function BudgetAdherenceChart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chartData = useMemo(() => {
    return mockBudgets.map(budget => {
      const category = mockCategories.find(cat => cat.id === budget.categoryId);
      return {
        name: category?.name.substring(0,15) || "Unknown", // Shorten name for axis
        budgeted: budget.amount,
        spent: budget.spentAmount,
      };
    }).filter(b => b.budgeted > 0 || b.spent > 0); // Only show relevant budgets
  }, []);

  if (!isClient) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Budget vs. Actual Spending</CardTitle>
          <CardDescription>Comparison of budgeted and spent amounts per category.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p>Loading chart...</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
            Monitor how well you are sticking to your budget.
        </CardFooter>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Budget vs. Actual Spending</CardTitle>
          <CardDescription>Comparison of budgeted and spent amounts per category.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p>No budget data available to display.</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
            Set some budgets to see adherence here.
        </CardFooter>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Budget vs. Actual Spending</CardTitle>
        <CardDescription>Comparison of budgeted and spent amounts per category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Legend />
            <Bar dataKey="budgeted" fill="var(--color-budgeted)" radius={4} />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
            Monitor how well you are sticking to your budget.
        </CardFooter>
    </Card>
  );
}
