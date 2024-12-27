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
}

const axiosRepositoryInstance = new AxiosRepository()

export default axiosRepositoryInstance

