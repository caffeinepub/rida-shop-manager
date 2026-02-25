import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddSalesTransaction } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SalesForm() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const addSales = useAddSalesTransaction();

  useEffect(() => {
    const qty = parseInt(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    setTotalAmount(qty * price);
  }, [quantity, unitPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    const qtyNum = parseInt(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast.error('Please enter a valid positive quantity');
      return;
    }

    const priceNum = parseFloat(unitPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid positive unit price');
      return;
    }

    try {
      await addSales.mutateAsync({
        itemName: itemName.trim(),
        quantity: BigInt(qtyNum),
        unitPrice: priceNum,
        customerName: customerName.trim() || null,
      });

      toast.success('Sales transaction added successfully');
      setItemName('');
      setQuantity('');
      setUnitPrice('');
      setCustomerName('');
      setTotalAmount(0);
    } catch (error) {
      toast.error('Failed to add sales transaction');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Sales Transaction</CardTitle>
        <CardDescription>Record a new sales transaction for today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                type="text"
                placeholder="e.g., Rida"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                type="text"
                placeholder="Optional"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="text"
                value={totalAmount.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <Button type="submit" disabled={addSales.isPending} className="w-full sm:w-auto">
            {addSales.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Sales Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
