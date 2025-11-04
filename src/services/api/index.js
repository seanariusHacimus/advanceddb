import axios from "axios";

const REPORTS_APP_API_URL =
  process.env.NODE_ENV === "development"
    ? "/api/reports"
    : process.env.REACT_APP_REPORTS_APP_API_URL;

const apiClient = axios.create({
  baseURL: REPORTS_APP_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
