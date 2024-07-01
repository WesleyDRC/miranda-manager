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

export { api };
