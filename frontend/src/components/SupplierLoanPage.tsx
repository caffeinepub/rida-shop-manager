import SupplierLoanForm from './SupplierLoanForm';
import SupplierLoanList from './SupplierLoanList';

export default function SupplierLoanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Supplier Loans</h2>
        <p className="text-muted-foreground">Track money borrowed by suppliers for personal use</p>
      </div>
      <SupplierLoanForm />
      <SupplierLoanList />
    </div>
  );
}
