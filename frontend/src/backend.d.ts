import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ItemName = string;
export type CustomerName = string;
export type Category = string;
export type Time = bigint;
export type SupplierName = string;
export type Description = string;
export interface Purchase {
    supplierName?: SupplierName;
    date: Time;
    totalCost: number;
    itemName: ItemName;
    quantity: bigint;
    unitCost: number;
}
export interface DailyRecord {
    date: Time;
    description: Description;
    category: Category;
    amount: number;
}
export interface SupplierLoan {
    repaid: boolean;
    supplierName: SupplierName;
    date: Time;
    amount: number;
    purpose: string;
}
export interface AdvancePayment {
    settled: boolean;
    supplierName: SupplierName;
    date: Time;
    amount: number;
    purpose: string;
}
export interface UserProfile {
    name: string;
}
export interface Transaction {
    customerName?: CustomerName;
    date: Time;
    totalAmount: number;
    itemName: ItemName;
    quantity: bigint;
    unitPrice: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdvancePayment(amount: number, supplierName: SupplierName, purpose: string): Promise<void>;
    addExpenseRecord(amount: number, category: Category, description: Description): Promise<void>;
    addIncomeRecord(amount: number, category: Category, description: Description): Promise<void>;
    addPurchaseRecord(itemName: ItemName, quantity: bigint, unitCost: number, supplierName: SupplierName | null): Promise<void>;
    addSalesTransaction(itemName: ItemName, quantity: bigint, unitPrice: number, customerName: CustomerName | null): Promise<void>;
    addSupplierLoan(amount: number, supplierName: SupplierName, purpose: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDailyRecord(): Promise<void>;
    deletePurchaseRecord(): Promise<void>;
    deleteTransaction(): Promise<void>;
    getAdvancePayments(): Promise<Array<AdvancePayment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyRecords(recordType: string): Promise<Array<DailyRecord>>;
    getPurchaseRecords(): Promise<Array<Purchase>>;
    getSalesTransactions(): Promise<Array<Transaction>>;
    getSupplierLoans(): Promise<Array<SupplierLoan>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    repaySupplierLoan(loanIndex: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    settleAdvancePayment(paymentIndex: bigint): Promise<boolean>;
}
