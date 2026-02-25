import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddSupplierLoan } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SupplierLoanForm() {
  const [amount, setAmount] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [purpose, setPurpose] = useState('');

  const addLoan = useAddSupplierLoan();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    if (!supplierName.trim()) {
      toast.error('Please enter supplier name');
      return;
    }

    try {
      await addLoan.mutateAsync({
        amount: amountNum,
        supplierName: supplierName.trim(),
        purpose: purpose.trim() || 'Personal use',
      });

      toast.success('Supplier loan recorded successfully');
      setAmount('');
      setSupplierName('');
      setPurpose('');
    } catch (error) {
      toast.error('Failed to record supplier loan');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Supplier Loan</CardTitle>
        <CardDescription>Record money borrowed by supplier for personal use</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name *</Label>
              <Input
                id="supplierName"
                type="text"
                placeholder="Enter supplier name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="Enter purpose (optional)"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={addLoan.isPending} className="w-full sm:w-auto">
            {addLoan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Loan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
