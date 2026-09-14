import axios from "axios";
import authService from "../services/authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//REQUEST INTERCEPTOR - Add authorization header to all requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint = originalRequest.url.includes("/auth/");
      const currentToken = sessionStorage.getItem("token");

      if (isAuthEndpoint || !currentToken) {
        sessionStorage.clear();
        throw error;
      }
      originalRequest._retry = true;

      try {
        const data = await authService.refreshToken();

        const newToken = data.result.token;

        sessionStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        sessionStorage.clear();
        throw refreshError;
      }
    }

    throw error;
  },
);

export default api;
