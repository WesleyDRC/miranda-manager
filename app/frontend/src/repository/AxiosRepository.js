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

}

export default new AxiosRepository();
