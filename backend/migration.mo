import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

module {
  type UserId = Principal;
  type DailyRecord = {
    date : Int;
    amount : Float;
    category : Text;
    description : Text;
  };

  type Transaction = {
    date : Int;
    itemName : Text;
    quantity : Nat;
    unitPrice : Float;
    totalAmount : Float;
    customerName : ?Text;
  };

  type Purchase = {
    date : Int;
    itemName : Text;
    quantity : Nat;
    unitCost : Float;
    totalCost : Float;
    supplierName : ?Text;
  };

  type OldActor = {
    incomeRecords : Map.Map<UserId, [DailyRecord]>;
    expenseRecords : Map.Map<UserId, [DailyRecord]>;
    salesTransactions : Map.Map<UserId, [Transaction]>;
    purchaseRecords : Map.Map<UserId, [Purchase]>;
  };

  type SupplierLoan = {
    amount : Float;
    date : Int;
    supplierName : Text;
    purpose : Text;
    repaid : Bool;
  };

  type AdvancePayment = {
    amount : Float;
    date : Int;
    supplierName : Text;
    purpose : Text;
    settled : Bool;
  };

  type NewActor = {
    incomeRecords : Map.Map<UserId, [DailyRecord]>;
    expenseRecords : Map.Map<UserId, [DailyRecord]>;
    salesTransactions : Map.Map<UserId, [Transaction]>;
    purchaseRecords : Map.Map<UserId, [Purchase]>;
    supplierLoans : Map.Map<UserId, [SupplierLoan]>;
    advancePayments : Map.Map<UserId, [AdvancePayment]>;
  };

  public func run(old : OldActor) : NewActor {
    let supplierLoans = Map.empty<UserId, [SupplierLoan]>();
    let advancePayments = Map.empty<UserId, [AdvancePayment]>();

    { old with supplierLoans; advancePayments };
  };
};
