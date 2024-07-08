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

  async createCategory({ name }) {
    console.log(name)

    return await this.#axiosClient.post("/category", {
      name
    })
  }

}

export default new AxiosRepository();
