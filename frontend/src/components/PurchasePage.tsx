import PurchaseForm from './PurchaseForm';
import PurchaseList from './PurchaseList';

export default function PurchasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
        <p className="text-muted-foreground">Track your purchase records</p>
      </div>
      <PurchaseForm />
      <PurchaseList />
    </div>
  );
}
