import api from "../libs/axios";

const authService = {
  signin: async (formData) => {
    const response = await api.post("/v1/auth/token", formData);
    return response.data;
  },
  signup: async (formData) => {
    const response = await api.post("/v1/users", formData);
    return response.data;
  },
  signout: async () => {
    const response = await api.post("/v1/auth/signout");
    return response.data;
  },
  refreshToken: async (refreshToken) => {
    const response = await api.post("/v1/auth/refresh", { refreshToken });
    return response.data;
  },
};

export default authService;
