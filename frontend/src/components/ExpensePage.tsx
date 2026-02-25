import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

export default function ExpensePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">Track your daily expense records</p>
      </div>
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
}
