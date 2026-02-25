import AdvancePaymentForm from './AdvancePaymentForm';
import AdvancePaymentList from './AdvancePaymentList';

export default function AdvancePaymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Advance Payments</h2>
        <p className="text-muted-foreground">Track advance payments given to suppliers</p>
      </div>
      <AdvancePaymentForm />
      <AdvancePaymentList />
    </div>
  );
}
