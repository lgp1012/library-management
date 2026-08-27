import api from "../libs/axios";

const authService = {
  signin: async (formData) => {
    const response = await api.post("/v1/auth/signin", formData);
    return response.data;
  },
  signup: async (formData) => {
    const response = await api.post("/v1/auth/signup", formData);
    return response.data;
  },
};

export default authService;
