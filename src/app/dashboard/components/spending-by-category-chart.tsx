"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { mockExpenses, mockCategories } from '@/lib/data';
import type { ChartConfig } from "@/components/ui/chart";
import { useMemo, useState, useEffect } from "react";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210, 40%, 70%)", // Lighter primary
  "hsl(16, 100%, 80%)", // Lighter accent
];

export default function SpendingByCategoryChart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { chartData, chartConfig } = useMemo(() => {
    const spendingByCategory: { [key: string]: number } = {};
    mockExpenses.forEach(expense => {
      spendingByCategory[expense.categoryId] = (spendingByCategory[expense.categoryId] || 0) + expense.amount;
    });

    const data = mockCategories
      .map((category, index) => ({
        name: category.name,
        value: spendingByCategory[category.id] || 0,
        fill: chartColors[index % chartColors.length],
        icon: category.icon,
      }))
      .filter(item => item.value > 0) // Only show categories with spending
      .sort((a, b) => b.value - a.value); // Sort by value descending

    const config: ChartConfig = {};
    data.forEach(item => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
        icon: item.icon,
      };
    });
    return { chartData: data, chartConfig: config };
  }, []);


  if (!isClient) {
    // Render placeholder or null on server to avoid hydration mismatch
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Monthly spending distribution.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p>Loading chart...</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
            Data from current month.
        </CardFooter>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Monthly spending distribution.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p>No spending data available for this period.</p>
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground">
            Add expenses to see them here.
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Monthly spending distribution.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-auto">
        <ChartLegend content={<ChartLegendContent nameKey="name" />} className="flex-wrap justify-center" />
      </CardFooter>
    </Card>
  );
}
