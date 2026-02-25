import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DailyRecord, Transaction, Purchase, SupplierLoan, AdvancePayment } from '../backend';

export function useGetDailyRecords(recordType: 'income' | 'expense') {
  const { actor, isFetching } = useActor();

  return useQuery<DailyRecord[]>({
    queryKey: ['dailyRecords', recordType],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getDailyRecords(recordType);
      } catch (error) {
        // Return empty array if no records found
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSalesTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['salesTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSalesTransactions();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPurchaseRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<Purchase[]>({
    queryKey: ['purchaseRecords'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPurchaseRecords();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSupplierLoans() {
  const { actor, isFetching } = useActor();

  return useQuery<SupplierLoan[]>({
    queryKey: ['supplierLoans'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSupplierLoans();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdvancePayments() {
  const { actor, isFetching } = useActor();

  return useQuery<AdvancePayment[]>({
    queryKey: ['advancePayments'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAdvancePayments();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddIncomeRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { amount: number; category: string; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addIncomeRecord(data.amount, data.category, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyRecords', 'income'] });
    },
  });
}

export function useAddExpenseRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { amount: number; category: string; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addExpenseRecord(data.amount, data.category, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyRecords', 'expense'] });
    },
  });
}

export function useAddSalesTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      itemName: string;
      quantity: bigint;
      unitPrice: number;
      customerName: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addSalesTransaction(
        data.itemName,
        data.quantity,
        data.unitPrice,
        data.customerName
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesTransactions'] });
    },
  });
}

export function useAddPurchaseRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      itemName: string;
      quantity: bigint;
      unitCost: number;
      supplierName: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addPurchaseRecord(
        data.itemName,
        data.quantity,
        data.unitCost,
        data.supplierName
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseRecords'] });
    },
  });
}

export function useAddSupplierLoan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      amount: number;
      supplierName: string;
      purpose: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addSupplierLoan(data.amount, data.supplierName, data.purpose);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplierLoans'] });
    },
  });
}

export function useRepaySupplierLoan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanIndex: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.repaySupplierLoan(loanIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplierLoans'] });
    },
  });
}

export function useAddAdvancePayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      amount: number;
      supplierName: string;
      purpose: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addAdvancePayment(data.amount, data.supplierName, data.purpose);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advancePayments'] });
    },
  });
}

export function useSettleAdvancePayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentIndex: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.settleAdvancePayment(paymentIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advancePayments'] });
    },
  });
}
