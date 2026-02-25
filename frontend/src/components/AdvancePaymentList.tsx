import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAdvancePayments, useSettleAdvancePayment } from '../hooks/useQueries';
import { formatCurrency, formatDate } from '../lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AdvancePaymentList() {
  const { data: payments = [], isLoading } = useGetAdvancePayments();
  const settlePayment = useSettleAdvancePayment();
  const [settlingIndex, setSettlingIndex] = useState<number | null>(null);

  // Sort by date descending (newest first)
  const sortedPayments = [...payments].sort((a, b) => Number(b.date - a.date));

  const handleSettle = async (index: number) => {
    setSettlingIndex(index);
    try {
      await settlePayment.mutateAsync(BigInt(index));
      toast.success('Payment marked as settled');
    } catch (error) {
      toast.error('Failed to mark payment as settled');
      console.error(error);
    } finally {
      setSettlingIndex(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advance Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (sortedPayments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advance Payments</CardTitle>
          <CardDescription>All advance payment records will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No advance payments yet. Add your first payment record above.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advance Payments</CardTitle>
        <CardDescription>{sortedPayments.length} total records</CardDescription>
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
              {sortedPayments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{formatDate(payment.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.supplierName}</TableCell>
                  <TableCell className="max-w-xs truncate">{payment.purpose}</TableCell>
                  <TableCell>
                    {payment.settled ? (
                      <Badge variant="secondary">Settled</Badge>
                    ) : (
                      <Badge variant="destructive">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!payment.settled && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSettle(index)}
                        disabled={settlingIndex === index}
                      >
                        {settlingIndex === index && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Mark Settled
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
