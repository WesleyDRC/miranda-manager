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

  async createFinance({ name, categoryId, rentId }) {
    return await this.#axiosClient.post("/finance", {
      name,
      categoryId,
      rentId
    })
  }

}

export default new AxiosRepository();
