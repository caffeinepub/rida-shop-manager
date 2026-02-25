import IncomeForm from './IncomeForm';
import IncomeList from './IncomeList';

export default function IncomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Income</h2>
        <p className="text-muted-foreground">Track your daily income records</p>
      </div>
      <IncomeForm />
      <IncomeList />
    </div>
  );
}
