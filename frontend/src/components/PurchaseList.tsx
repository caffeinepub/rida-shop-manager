import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetPurchaseRecords } from '../hooks/useQueries';
import { formatCurrency, formatDate } from '../lib/utils';

export default function PurchaseList() {
  const { data: purchases = [], isLoading } = useGetPurchaseRecords();

  // Sort by date descending (newest first)
  const sortedPurchases = [...purchases].sort((a, b) => Number(b.date - a.date));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (sortedPurchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Records</CardTitle>
          <CardDescription>All your purchase records will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No purchase records yet. Add your first record above.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Records</CardTitle>
        <CardDescription>{sortedPurchases.length} total records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPurchases.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{formatDate(purchase.date)}</TableCell>
                  <TableCell>{purchase.itemName}</TableCell>
                  <TableCell>{purchase.quantity.toString()}</TableCell>
                  <TableCell>{formatCurrency(purchase.unitCost)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(purchase.totalCost)}</TableCell>
                  <TableCell>{purchase.supplierName || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
