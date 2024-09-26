import axios from "axios";
import { router } from "../routes/index";

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      router.push("/auth/login");
    }
    return Promise.reject(error);
  }
);

export default http;
