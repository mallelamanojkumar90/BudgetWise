"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { Expense } from '@/lib/types';
import type { ChartConfig } from "@/components/ui/chart";
import { format, eachDayOfInterval } from 'date-fns';
import { useMemo, useState, useEffect } from "react";

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface SpendingOverTimeChartProps {
    expenses: Expense[];
    dateRange: { from: Date, to: Date };
}

export default function SpendingOverTimeChart({ expenses, dateRange }: SpendingOverTimeChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const chartData = useMemo(() => {
    const daysInInterval = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

    const dailySpending = daysInInterval.map(day => {
      const dayStr = format(day, "MMM dd");
      const total = expenses
        .filter(exp => format(exp.date.toDate(), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { date: dayStr, spending: total };
    });
    return dailySpending;
  }, [expenses, dateRange]);

  const tickFormatter = (value: string) => {
     if (chartData.length > 31) {
        // Show only month for longer ranges
        const month = value.slice(0,3);
        if(chartData.find(d => d.date === value)?.date.endsWith(" 01")) {
            return month;
        }
        return "";
     }
     return value;
  }

  if (!isClient) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Spending Over Time</CardTitle>
          <CardDescription>Daily spending for the selected period.</CardDescription>
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
        <CardDescription>Daily spending for the selected period.</CardDescription>
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
              tickFormatter={tickFormatter}
            />
            <YAxis 
             tickFormatter={(value) => `₹${value}`}
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
