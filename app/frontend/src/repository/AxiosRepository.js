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
    startRental
  }) {
    return await this.#axiosClient.post("/finance", {
      name,
      category,
      rent: {
        tenant: tenant,
        value: rentalValue,
        street: rentalStreet,
        streetNumber: rentalStreetNumber,
        startRental: startRental
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
}

const axiosRepositoryInstance = new AxiosRepository()

export default axiosRepositoryInstance

