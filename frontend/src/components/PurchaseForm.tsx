import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddPurchaseRecord } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PurchaseForm() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  const addPurchase = useAddPurchaseRecord();

  useEffect(() => {
    const qty = parseInt(quantity) || 0;
    const cost = parseFloat(unitCost) || 0;
    setTotalCost(qty * cost);
  }, [quantity, unitCost]);

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

    const costNum = parseFloat(unitCost);
    if (isNaN(costNum) || costNum <= 0) {
      toast.error('Please enter a valid positive unit cost');
      return;
    }

    try {
      await addPurchase.mutateAsync({
        itemName: itemName.trim(),
        quantity: BigInt(qtyNum),
        unitCost: costNum,
        supplierName: supplierName.trim() || null,
      });

      toast.success('Purchase record added successfully');
      setItemName('');
      setQuantity('');
      setUnitCost('');
      setSupplierName('');
      setTotalCost(0);
    } catch (error) {
      toast.error('Failed to add purchase record');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Purchase Record</CardTitle>
        <CardDescription>Record a new purchase for today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                type="text"
                placeholder="e.g., Fabric"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name</Label>
              <Input
                id="supplierName"
                type="text"
                placeholder="Optional"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
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
              <Label htmlFor="unitCost">Unit Cost *</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input
                id="totalCost"
                type="text"
                value={totalCost.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <Button type="submit" disabled={addPurchase.isPending} className="w-full sm:w-auto">
            {addPurchase.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Purchase Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
