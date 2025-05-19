"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockExpenses } from '@/lib/data';
import type { ChartConfig } from "@/components/ui/chart";
import { format, startOfMonth, eachDayOfInterval, subMonths } from 'date-fns';
import { useMemo, useState, useEffect } from "react";

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function SpendingOverTimeChart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const chartData = useMemo(() => {
    // Aggregate expenses by day for the last 30 days (or current month)
    const endDate = new Date();
    const startDate = subMonths(endDate, 1); // Last 30 days approx
    // const startDate = startOfMonth(new Date()); // Current month

    const daysInInterval = eachDayOfInterval({ start: startDate, end: endDate });

    const dailySpending = daysInInterval.map(day => {
      const dayStr = format(day, "MMM dd");
      const total = mockExpenses
        .filter(exp => format(exp.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { date: dayStr, spending: total };
    });
    return dailySpending;
  }, []);


  if (!isClient) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Spending Over Time</CardTitle>
          <CardDescription>Daily spending for the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
           <p>Loading chart...</p>
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground">
           Track your daily financial flow.
        </CardFooter>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Spending Over Time</CardTitle>
        <CardDescription>Daily spending for the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)} // Shorten date label
            />
            <YAxis 
             tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="text-xs text-muted-foreground">
           Track your daily financial flow.
        </CardFooter>
    </Card>
  );
}
