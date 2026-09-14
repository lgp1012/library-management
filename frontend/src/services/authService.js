import api from "../libs/axios";

const authService = {
  signin: async (formData) => {
    const response = await api.post("/auth/token", formData);
    return response.data;
  },
  signup: async (formData) => {
    const response = await api.post("/readers/register", formData);
    return response.data;
  },
  signout: async ({ token }) => {
    const response = await api.post("/auth/logout", { token });
    return response.data;
  },
  fetchMe: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
  refreshToken: async () => {
    const token = sessionStorage.getItem("token");
    const response = await api.post("/auth/refresh", { token });
    return response.data;
  },
};

export default authService;
