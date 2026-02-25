import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetSupplierLoans, useRepaySupplierLoan } from '../hooks/useQueries';
import { formatCurrency, formatDate } from '../lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SupplierLoanList() {
  const { data: loans = [], isLoading } = useGetSupplierLoans();
  const repayLoan = useRepaySupplierLoan();
  const [repayingIndex, setRepayingIndex] = useState<number | null>(null);

  // Sort by date descending (newest first)
  const sortedLoans = [...loans].sort((a, b) => Number(b.date - a.date));

  const handleRepay = async (index: number) => {
    setRepayingIndex(index);
    try {
      await repayLoan.mutateAsync(BigInt(index));
      toast.success('Loan marked as repaid');
    } catch (error) {
      toast.error('Failed to mark loan as repaid');
      console.error(error);
    } finally {
      setRepayingIndex(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supplier Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (sortedLoans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supplier Loans</CardTitle>
          <CardDescription>All supplier loan records will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No supplier loans yet. Add your first loan record above.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Loans</CardTitle>
        <CardDescription>{sortedLoans.length} total records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLoans.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{formatDate(loan.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(loan.amount)}</TableCell>
                  <TableCell>{loan.supplierName}</TableCell>
                  <TableCell className="max-w-xs truncate">{loan.purpose}</TableCell>
                  <TableCell>
                    {loan.repaid ? (
                      <Badge variant="secondary">Repaid</Badge>
                    ) : (
                      <Badge variant="destructive">Outstanding</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!loan.repaid && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRepay(index)}
                        disabled={repayingIndex === index}
                      >
                        {repayingIndex === index && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Mark Repaid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
