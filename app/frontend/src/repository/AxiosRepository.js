import { api } from "../services/api";

class AxiosRepository {
  #axiosClient;

  constructor() {
    this.#axiosClient = api;
  }

  async signIn({ email, password }) {
    return await this.#axiosClient.post("/auth/signIn", {
      email,
      password
    })
  }

  async createUser({ email, password, confirmPassword }) {
    return await this.#axiosClient.post("/auth/signUp", {
      email,
      password,
      confirmPassword,
    });
  }

  async getFinances() {
    return await this.#axiosClient.get("/finance");
  }

  async getFinanceById({id}) {
    return await this.#axiosClient.get(`/finance/${id}`)
  }

  async createFinance({
    name,
    category,
    tenant,
    rentalValue,
    rentalStreet,
    rentalStreetNumber,
    startRental,
    fixedExpenses
  }) {
    return await this.#axiosClient.post("/finance", {
      name,
      category,
      rent: {
        tenant: tenant,
        value: rentalValue,
        street: rentalStreet,
        streetNumber: rentalStreetNumber,
        startRental: startRental,
        fixedExpenses: fixedExpenses
      },
    });
  }

  async createCategory({ name }) {
    return await this.#axiosClient.post("/category", {
      name,
    });
  }

  async getCategories() {
    return await this.#axiosClient.get("/category");
  }

  async getRentById({id}) {
    return await this.#axiosClient.get(`/rent/${id}`)
  }

  async getRentDashboard() {
    return await this.#axiosClient.get("/rent");
  }

  async updateRent(id, updates) {
    return await this.#axiosClient.patch(`/rent/${id}`, updates);
  }

  async updateRentMonth({rentId, rentMonthId, dateMonth, amountPaid, paid, receipt}) {
    return this.#axiosClient.patch(`/rent/${rentId}/month/${rentMonthId}`, {
      dateMonth,
      amountPaid,
      paid
    });
  }

  async createExpense({ amount, reason, rentMonthId}) {
    return this.#axiosClient.post("/rent/expense", {
      amount,
      reason,
      rentMonthId
    })
  }
  
  async updateExpense({ id, amount, reason}) {
    return this.#axiosClient.patch(`/rent/expense/${id}`, {
      amount,
      reason
    })
  }
  
  async deleteExpense({ id }) {
    return this.#axiosClient.delete(`/rent/expense/${id}`)
  }

  async createRentReceipt({ rentMonthId, receipt }) {
    const formData = new FormData();
    formData.append("receipt", receipt); 

    return this.#axiosClient.post(`/rent/receipt/${rentMonthId}`, formData,{
      headers: {
        "Content-Type": "multipart/form-data"
      },
    })
  }

  async getRentReceiptsByRentMonthId({rentMonthId}) {
    return await this.#axiosClient.get(`/rent/receipt/${rentMonthId}`)
  }

  async deleteRentReceipt({ id }) {
    return await this.#axiosClient.delete(`/rent/receipt/${id}`);
  }

  async createRentPayment({ amount, paymentDate, rentMonthId }) {
    return this.#axiosClient.post("/rent/payment", {
      amount,
      paymentDate,
      rentMonthId
    });
  }

  async deleteRentPayment({ id }) {
    return this.#axiosClient.delete(`/rent/payment/${id}`);
  }

  async getForecastDashboard(scenario) {
    const url = scenario ? `/forecast/dashboard?simulateScenario=${scenario}` : "/forecast/dashboard";
    return await this.#axiosClient.get(url);
  }

  // Wallets
  async getWallets() {
    return await this.#axiosClient.get("/wallet");
  }

  async createWallet({ name, balance }) {
    return await this.#axiosClient.post("/wallet", { name, balance });
  }

  async updateWallet(id, { name, balance }) {
    return await this.#axiosClient.patch(`/wallet/${id}`, { name, balance });
  }

  async deleteWallet(id) {
    return await this.#axiosClient.delete(`/wallet/${id}`);
  }

  // Patrimony
  async getPatrimonies() {
    return await this.#axiosClient.get("/patrimony");
  }

  async getPatrimonyById({ id }) {
    return await this.#axiosClient.get(`/patrimony/${id}`);
  }

  async createPatrimony({ name, type, marketValue, isFinanced, financingDetails }) {
    return await this.#axiosClient.post("/patrimony", {
      name,
      type,
      marketValue,
      isFinanced,
      financingDetails
    });
  }

  async deletePatrimony({ id }) {
    return await this.#axiosClient.delete(`/patrimony/${id}`);
  }

  async updatePatrimony(id, updates) {
    return await this.#axiosClient.patch(`/patrimony/${id}`, updates);
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await this.#axiosClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  // Transactions
  async getTransactions() {
    return await this.#axiosClient.get("/transaction");
  }

  async getTransactionsByPatrimonyId(patrimonyId) {
    return await this.#axiosClient.get(`/transaction/patrimony/${patrimonyId}`);
  }

  async createTransaction({ type, amount, dueDate, isPaid, isRecurring, source, description, walletId, patrimonyId, endDate }) {
    return await this.#axiosClient.post("/transaction", {
      type, amount, dueDate, isPaid, isRecurring, source, description, walletId, patrimonyId, endDate
    });
  }

  async updateTransaction(id, updates) {
    return await this.#axiosClient.patch(`/transaction/${id}`, updates);
  }

  async deleteTransaction(id, deleteHistory = false) {
    const query = deleteHistory ? "?deleteHistory=true" : "";
    return await this.#axiosClient.delete(`/transaction/${id}${query}`);
  }

  // Treasury
  async getTreasuries() {
    return await this.#axiosClient.get("/treasury");
  }

  async getTreasuryProducts() {
    return await this.#axiosClient.get("/treasury/products");
  }

  async createTreasuryProduct({ name, treasuryType, maturityDate }) {
    return await this.#axiosClient.post("/treasury/products", {
      name, treasuryType, maturityDate
    });
  }

  async updateTreasuryProduct(id, { name, treasuryType, maturityDate }) {
    return await this.#axiosClient.put(`/treasury/products/${id}`, {
      name, treasuryType, maturityDate
    });
  }

  async deleteTreasuryProduct(id) {
    return await this.#axiosClient.delete(`/treasury/products/${id}`);
  }

  async getTreasuryById({ id }) {
    return await this.#axiosClient.get(`/treasury/${id}`);
  }

  async createTreasury({ treasuryType, titleName, purchaseDate, maturityDate, investedAmount, annualRate, liquidityAvailable, quantity, unitPrice, notes }) {
    return await this.#axiosClient.post("/treasury", {
      treasuryType, titleName, purchaseDate, maturityDate, investedAmount, annualRate, liquidityAvailable, quantity, unitPrice, notes
    });
  }

  async deleteTreasury({ id }) {
    return await this.#axiosClient.delete(`/treasury/${id}`);
  }

  async createTreasuryMovement({ treasuryId, movementType, amount, movementDate, description }) {
    return await this.#axiosClient.post(`/treasury/${treasuryId}/movement`, {
      movementType, amount, movementDate, description
    });
  }

  async deleteTreasuryMovement({ id }) {
    return await this.#axiosClient.delete(`/treasury/movement/${id}`);
  }

  async getTreasuryMovements(treasuryId) {
    return await this.#axiosClient.get(`/treasury/${treasuryId}/movement`);
  }

  async getTreasurySnapshots(treasuryId) {
    return await this.#axiosClient.get(`/treasury/${treasuryId}/snapshot`);
  }

  async bulkUpdateTreasuryMarketPrice(payload) {
    return await this.#axiosClient.patch('/treasury/bulk-market-price', payload);
  }

  async getIpcaFocus() {
    return await this.#axiosClient.get("/market-data/ipca");
  }

  async previewTreasuryExcel(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await this.#axiosClient.post("/treasury/import-excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  async confirmTreasuryImport(rows) {
    return await this.#axiosClient.post("/treasury/import-excel/confirm", { rows });
  }
}

const axiosRepositoryInstance = new AxiosRepository()

export default axiosRepositoryInstance
