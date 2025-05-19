
"use client";
// This component is very similar to the dashboard's SpendingByCategoryChart
// but could be adapted for more detailed reporting options in the future (e.g., date range selection)

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { mockExpenses, mockCategories } from '@/lib/data';
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
  "hsl(210, 40%, 50%)",
  "hsl(16, 100%, 65%)",
  "hsl(120, 40%, 60%)",
];

export default function CategoryBreakdownChart() {
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
        iconName: category.iconName, // Store iconName
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const config: ChartConfig = {};
    data.forEach(item => {
      const IconComponent = LucideIcons[item.iconName as keyof typeof LucideIcons] || LucideIcons.Tag;
      config[item.name] = {
        label: item.name,
        color: item.fill,
        icon: IconComponent, // Look up the component
      };
    });
    return { chartData: data, chartConfig: config };
  }, []);
  

  if (!isClient) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detailed Category Breakdown</CardTitle>
          <CardDescription>Full overview of spending by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
           <p>Loading chart...</p>
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground pt-4">
          Data from the current period.
        </CardFooter>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detailed Category Breakdown</CardTitle>
          <CardDescription>Full overview of spending by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p>No spending data to display.</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-4">
          Add expenses to see the breakdown here.
        </CardFooter>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Detailed Category Breakdown</CardTitle>
        <CardDescription>Full overview of spending by category.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={80} // Larger inner radius for a "doughnut" look
              outerRadius={140}
              strokeWidth={2}
              labelLine={false}
              // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Optional labels
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" className="flex-wrap justify-center" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-4">
        Detailed overview of spending by category.
      </CardFooter>
    </Card>
  );
}
