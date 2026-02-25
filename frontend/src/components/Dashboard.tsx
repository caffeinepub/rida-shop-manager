import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetDailyRecords, useGetSalesTransactions, useGetPurchaseRecords, useGetSupplierLoans, useGetAdvancePayments } from '../hooks/useQueries';
import { TrendingUp, TrendingDown, ShoppingCart, Package, DollarSign, HandCoins, Wallet } from 'lucide-react';
import { formatCurrency, isToday } from '../lib/utils';

export default function Dashboard() {
  const { data: incomeRecords = [], isLoading: incomeLoading } = useGetDailyRecords('income');
  const { data: expenseRecords = [], isLoading: expenseLoading } = useGetDailyRecords('expense');
  const { data: salesTransactions = [], isLoading: salesLoading } = useGetSalesTransactions();
  const { data: purchaseRecords = [], isLoading: purchaseLoading } = useGetPurchaseRecords();
  const { data: supplierLoans = [], isLoading: loansLoading } = useGetSupplierLoans();
  const { data: advancePayments = [], isLoading: paymentsLoading } = useGetAdvancePayments();

  const isLoading = incomeLoading || expenseLoading || salesLoading || purchaseLoading || loansLoading || paymentsLoading;

  // Filter today's records
  const todayIncome = incomeRecords.filter(record => isToday(record.date));
  const todayExpenses = expenseRecords.filter(record => isToday(record.date));
  const todaySales = salesTransactions.filter(transaction => isToday(transaction.date));
  const todayPurchases = purchaseRecords.filter(purchase => isToday(purchase.date));

  // Calculate totals
  const totalIncome = todayIncome.reduce((sum, record) => sum + record.amount, 0);
  const totalExpenses = todayExpenses.reduce((sum, record) => sum + record.amount, 0);
  const totalSales = todaySales.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
  const totalPurchases = todayPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
  const netProfit = totalIncome + totalSales - totalExpenses - totalPurchases;

  // Calculate outstanding supplier loans and pending advance payments
  const outstandingLoans = supplierLoans
    .filter(loan => !loan.repaid)
    .reduce((sum, loan) => sum + loan.amount, 0);
  
  const pendingPayments = advancePayments
    .filter(payment => !payment.settled)
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(7)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Today's Summary</h2>
        <p className="text-muted-foreground">Overview of your daily business operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayIncome.length} {todayIncome.length === 1 ? 'record' : 'records'} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayExpenses.length} {todayExpenses.length === 1 ? 'record' : 'records'} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todaySales.length} {todaySales.length === 1 ? 'transaction' : 'transactions'} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <Package className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayPurchases.length} {todayPurchases.length === 1 ? 'record' : 'records'} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Supplier Loans</CardTitle>
            <HandCoins className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(outstandingLoans)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {supplierLoans.filter(l => !l.repaid).length} unpaid {supplierLoans.filter(l => !l.repaid).length === 1 ? 'loan' : 'loans'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Advance Payments</CardTitle>
            <Wallet className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingPayments)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {advancePayments.filter(p => !p.settled).length} unsettled {advancePayments.filter(p => !p.settled).length === 1 ? 'payment' : 'payments'}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-chart-1' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-chart-1' : 'text-destructive'}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {netProfit >= 0 ? 'Profit' : 'Loss'} for today
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
