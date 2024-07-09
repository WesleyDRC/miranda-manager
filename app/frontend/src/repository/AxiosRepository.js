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
}

export default new AxiosRepository();
