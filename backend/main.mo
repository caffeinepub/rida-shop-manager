import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type definitions
  type UserId = Principal;
  type Category = Text;
  type Description = Text;
  type ItemName = Text;
  type CustomerName = Text;
  type SupplierName = Text;

  public type UserProfile = {
    name : Text;
  };

  type DailyRecord = {
    date : Time.Time;
    amount : Float;
    category : Category;
    description : Description;
  };

  module DailyRecord {
    public func compare(a : DailyRecord, b : DailyRecord) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  type Transaction = {
    date : Time.Time;
    itemName : ItemName;
    quantity : Nat;
    unitPrice : Float;
    totalAmount : Float;
    customerName : ?CustomerName;
  };

  module Transaction {
    public func compare(a : Transaction, b : Transaction) : Order.Order {
      if (a.date < b.date) { return #less };
      if (a.date > b.date) { return #greater };
      Text.compare(a.itemName, b.itemName);
    };
  };

  type Purchase = {
    date : Time.Time;
    itemName : ItemName;
    quantity : Nat;
    unitCost : Float;
    totalCost : Float;
    supplierName : ?SupplierName;
  };

  module Purchase {
    public func compare(a : Purchase, b : Purchase) : Order.Order {
      if (a.date < b.date) { return #less };
      if (a.date > b.date) { return #greater };
      Text.compare(a.itemName, b.itemName);
    };
  };

  type SupplierLoan = {
    amount : Float;
    date : Time.Time;
    supplierName : SupplierName;
    purpose : Text;
    repaid : Bool;
  };

  module SupplierLoan {
    public func compare(a : SupplierLoan, b : SupplierLoan) : Order.Order {
      if (a.date < b.date) { return #less };
      if (a.date > b.date) { return #greater };
      Text.compare(a.supplierName, b.supplierName);
    };
  };

  type AdvancePayment = {
    amount : Float;
    date : Time.Time;
    supplierName : SupplierName;
    purpose : Text;
    settled : Bool;
  };

  module AdvancePayment {
    public func compare(a : AdvancePayment, b : AdvancePayment) : Order.Order {
      if (a.date < b.date) { return #less };
      if (a.date > b.date) { return #greater };
      Text.compare(a.supplierName, b.supplierName);
    };
  };

  // Data storage
  let incomeRecords = Map.empty<UserId, [DailyRecord]>();
  let expenseRecords = Map.empty<UserId, [DailyRecord]>();
  let salesTransactions = Map.empty<UserId, [Transaction]>();
  let purchaseRecords = Map.empty<UserId, [Purchase]>();
  let supplierLoans = Map.empty<UserId, [SupplierLoan]>();
  let advancePayments = Map.empty<UserId, [AdvancePayment]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Income and expense records
  public shared ({ caller }) func addIncomeRecord(amount : Float, category : Category, description : Description) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add income records");
    };

    let newRecord : DailyRecord = {
      date = Time.now();
      amount;
      category;
      description;
    };

    let userRecords = switch (incomeRecords.get(caller)) {
      case (null) { [] };
      case (?records) { records };
    };

    let updatedRecords = userRecords.concat([newRecord]);
    incomeRecords.add(caller, updatedRecords);
  };

  public shared ({ caller }) func addExpenseRecord(amount : Float, category : Category, description : Description) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add expense records");
    };

    let newRecord : DailyRecord = {
      date = Time.now();
      amount;
      category;
      description;
    };

    let userRecords = switch (expenseRecords.get(caller)) {
      case (null) { [] };
      case (?records) { records };
    };

    let updatedRecords = userRecords.concat([newRecord]);
    expenseRecords.add(caller, updatedRecords);
  };

  // Sales transactions
  public shared ({ caller }) func addSalesTransaction(itemName : ItemName, quantity : Nat, unitPrice : Float, customerName : ?CustomerName) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add sales transactions");
    };

    let newTransaction : Transaction = {
      date = Time.now();
      itemName;
      quantity;
      unitPrice;
      totalAmount = unitPrice * quantity.toFloat();
      customerName;
    };

    let userTransactions = switch (salesTransactions.get(caller)) {
      case (null) { [] };
      case (?transactions) { transactions };
    };

    let updatedTransactions = userTransactions.concat([newTransaction]);
    salesTransactions.add(caller, updatedTransactions);
  };

  // Purchase records
  public shared ({ caller }) func addPurchaseRecord(itemName : ItemName, quantity : Nat, unitCost : Float, supplierName : ?SupplierName) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add purchase records");
    };

    let newPurchase : Purchase = {
      date = Time.now();
      itemName;
      quantity;
      unitCost;
      totalCost = unitCost * quantity.toFloat();
      supplierName;
    };

    let userPurchases = switch (purchaseRecords.get(caller)) {
      case (null) { [] };
      case (?purchases) { purchases };
    };

    let updatedPurchases = userPurchases.concat([newPurchase]);
    purchaseRecords.add(caller, updatedPurchases);
  };

  // Supplier loans
  public shared ({ caller }) func addSupplierLoan(amount : Float, supplierName : SupplierName, purpose : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add supplier loans");
    };

    let newLoan : SupplierLoan = {
      amount;
      date = Time.now();
      supplierName;
      purpose;
      repaid = false;
    };

    let userLoans = switch (supplierLoans.get(caller)) {
      case (null) { [] };
      case (?loans) { loans };
    };

    let updatedLoans = userLoans.concat([newLoan]);
    supplierLoans.add(caller, updatedLoans);
  };

  // Advance payments
  public shared ({ caller }) func addAdvancePayment(amount : Float, supplierName : SupplierName, purpose : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add advance payments");
    };

    let newPayment : AdvancePayment = {
      amount;
      date = Time.now();
      supplierName;
      purpose;
      settled = false;
    };

    let userPayments = switch (advancePayments.get(caller)) {
      case (null) { [] };
      case (?payments) { payments };
    };

    let updatedPayments = userPayments.concat([newPayment]);
    advancePayments.add(caller, updatedPayments);
  };

  // Query functions
  public query ({ caller }) func getDailyRecords(recordType : Text) : async [DailyRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view records");
    };

    let records = switch (recordType) {
      case ("income") { incomeRecords.get(caller) };
      case ("expense") { expenseRecords.get(caller) };
      case (_) { Runtime.trap("Invalid record type") };
    };
    switch (records) {
      case (null) { [] };
      case (?recordsArray) { recordsArray.sort() };
    };
  };

  public query ({ caller }) func getSalesTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sales transactions");
    };

    switch (salesTransactions.get(caller)) {
      case (null) { [] };
      case (?transactions) { transactions.sort() };
    };
  };

  public query ({ caller }) func getPurchaseRecords() : async [Purchase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view purchase records");
    };

    switch (purchaseRecords.get(caller)) {
      case (null) { [] };
      case (?purchases) { purchases.sort() };
    };
  };

  public query ({ caller }) func getSupplierLoans() : async [SupplierLoan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view supplier loans");
    };

    switch (supplierLoans.get(caller)) {
      case (null) { [] };
      case (?loans) { loans.sort() };
    };
  };

  public query ({ caller }) func getAdvancePayments() : async [AdvancePayment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view advance payments");
    };

    switch (advancePayments.get(caller)) {
      case (null) { [] };
      case (?payments) { payments.sort() };
    };
  };

  // Update functions
  public shared ({ caller }) func repaySupplierLoan(loanIndex : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can repay supplier loans");
    };

    switch (supplierLoans.get(caller)) {
      case (null) { Runtime.trap("No supplier loans found") };
      case (?loans) {
        if (loanIndex >= loans.size()) {
          Runtime.trap("Invalid loan index");
        };
        let updatedArray = Array.tabulate(
          loans.size(),
          func(i) {
            if (i == loanIndex) {
              { loans[i] with repaid = true };
            } else {
              loans[i];
            };
          },
        );
        supplierLoans.add(caller, updatedArray);
        true;
      };
    };
  };

  public shared ({ caller }) func settleAdvancePayment(paymentIndex : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can settle advance payments");
    };

    switch (advancePayments.get(caller)) {
      case (null) { Runtime.trap("No advance payments found") };
      case (?payments) {
        if (paymentIndex >= payments.size()) {
          Runtime.trap("Invalid payment index");
        };
        let updatedArray = Array.tabulate(
          payments.size(),
          func(i) {
            if (i == paymentIndex) {
              { payments[i] with settled = true };
            } else {
              payments[i];
            };
          },
        );
        advancePayments.add(caller, updatedArray);
        true;
      };
    };
  };

  // Placeholder delete functions
  public shared ({ caller }) func deleteDailyRecord() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete records");
    };
    Runtime.trap("Unimplemented");
  };

  public shared ({ caller }) func deleteTransaction() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete transactions");
    };
    Runtime.trap("Unimplemented");
  };

  public shared ({ caller }) func deletePurchaseRecord() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete purchase records");
    };
    Runtime.trap("Unimplemented");
  };
};

