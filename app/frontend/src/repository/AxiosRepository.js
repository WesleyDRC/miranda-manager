import { api } from "../services/api";

class AxiosRepository {
  #axiosClient;

  constructor() {
    this.#axiosClient = api;
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
    categoryId,
    rentalName,
    rentalValue,
    rentalStreet,
    rentalStreetNumber,
    startRental,
  }) {
    return await this.#axiosClient.post("/finance", {
      name,
      categoryId,
      rent: {
        name: rentalName,
        value: rentalValue,
        street: rentalStreet,
        streetNumber: rentalStreetNumber,
        startRental: startRental,
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

  async updateRentMonth({rentId, rentMonthId, dateMonth, amountPaid, paid}) {
    return this.#axiosClient.patch(`/rent/${rentId}/month/${rentMonthId}`, {
      dateMonth,
      amountPaid,
      paid
    });
  }
}

const axiosRepositoryInstance = new AxiosRepository()

export default axiosRepositoryInstance

