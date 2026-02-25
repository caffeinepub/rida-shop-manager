import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetDailyRecords } from '../hooks/useQueries';
import { formatCurrency, formatDate } from '../lib/utils';

export default function IncomeList() {
  const { data: records = [], isLoading } = useGetDailyRecords('income');

  // Sort by date descending (newest first)
  const sortedRecords = [...records].sort((a, b) => Number(b.date - a.date));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (sortedRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
          <CardDescription>All your income records will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No income records yet. Add your first record above.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Records</CardTitle>
        <CardDescription>{sortedRecords.length} total records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{formatDate(record.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(record.amount)}</TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
