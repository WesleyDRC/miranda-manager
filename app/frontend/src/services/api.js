import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Context-Type": "application/json",
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

api.interceptors.request.use(async (config) => {
  const userToken = localStorage.getItem("user_token");

  try {
    if(userToken) {
      config.headers.Authorization = `Bearer ${JSON.parse(userToken)}`
    }
    return config
  } catch (error) {
    return Promise.reject(error);
  }
})

export { api };
