"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import type { Expense, Category } from '@/lib/types';
import type { ChartConfig } from "@/components/ui/chart";
import { useMemo, useState, useEffect } from "react";
import * as LucideIcons from 'lucide-react';

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210, 40%, 70%)",
  "hsl(16, 100%, 80%)",
];

interface SpendingByCategoryChartProps {
    expenses: Expense[];
    categories: Category[];
}

export default function SpendingByCategoryChart({ expenses, categories }: SpendingByCategoryChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { chartData, chartConfig } = useMemo(() => {
    const spendingByCategory: { [key: string]: number } = {};
    expenses.forEach(expense => {
      spendingByCategory[expense.categoryId] = (spendingByCategory[expense.categoryId] || 0) + expense.amount;
    });

    const data = categories
      .map((category, index) => ({
        name: category.name,
        value: spendingByCategory[category.id] || 0,
        fill: chartColors[index % chartColors.length],
        iconName: category.iconName,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const config: ChartConfig = {};
    data.forEach(item => {
      const IconComponent = LucideIcons[item.iconName as keyof typeof LucideIcons] || LucideIcons.Tag;
      config[item.name] = {
        label: item.name,
        color: item.fill,
        icon: IconComponent,
      };
    });
    return { chartData: data, chartConfig: config };
  }, [expenses, categories]);


  if (!isClient) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Monthly spending distribution.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p>Loading chart...</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-4">
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
         <CardFooter className="text-xs text-muted-foreground pt-4">
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
            <ChartLegend content={<ChartLegendContent nameKey="name" className="flex-wrap justify-center"/>} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-4">
        Current month's spending breakdown by category.
      </CardFooter>
    </Card>
  );
}
