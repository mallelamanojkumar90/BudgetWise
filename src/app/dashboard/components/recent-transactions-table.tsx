import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockExpenses, mockCategories } from '@/lib/data';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

export default function RecentTransactionsTable() {
  const recentExpenses = mockExpenses
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5); // Show latest 5

  const getCategoryName = (categoryId: string) => {
    return mockCategories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest 5 expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExpenses.length > 0 ? recentExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(expense.categoryId)}</Badge>
                  </TableCell>
                  <TableCell>{format(expense.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No recent transactions.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
