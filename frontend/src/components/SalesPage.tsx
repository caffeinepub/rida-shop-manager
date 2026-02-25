import SalesForm from './SalesForm';
import SalesList from './SalesList';

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <p className="text-muted-foreground">Track your sales transactions</p>
      </div>
      <SalesForm />
      <SalesList />
    </div>
  );
}
