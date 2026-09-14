import api from "../libs/axios";

const adminService = {
  // --- EMPLOYEES ---
  listEmployees: async () => {
    const res = await api.get("/admin/employees");
    return res.data;
  },
  createEmployee: async (employeeData) => {
    const res = await api.post("/admin/employees", employeeData);
    return res.data;
  },
  deactivateEmployee: async (employeeId) => {
    const res = await api.put(`/admin/employees/${employeeId}/deactivate`);
    return res.data;
  },

  // --- CATEGORIES ---
  listCategories: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
  createCategory: async (categoryData) => {
    const res = await api.post("/admin/categories", categoryData);
    return res.data;
  },
  updateCategory: async (categoryId, categoryData) => {
    const res = await api.put(`/admin/categories/${categoryId}`, categoryData);
    return res.data;
  },
  deleteCategory: async (categoryId) => {
    const res = await api.delete(`/admin/categories/${categoryId}`);
    return res.data;
  },

  // --- AUTHORS ---
  listAuthors: async () => {
    const res = await api.get("/authors");
    return res.data;
  },
  createAuthor: async (authorData) => {
    const res = await api.post("/admin/authors", authorData);
    return res.data;
  },
  updateAuthor: async (authorId, authorData) => {
    const res = await api.put(`/admin/authors/${authorId}`, authorData);
    return res.data;
  },
  deleteAuthor: async (authorId) => {
    const res = await api.delete(`/admin/authors/${authorId}`);
    return res.data;
  },

  // --- PUBLISHERS ---
  listPublishers: async () => {
    const res = await api.get("/publishers");
    return res.data;
  },
  createPublisher: async (publisherData) => {
    const res = await api.post("/admin/publishers", publisherData);
    return res.data;
  },
  updatePublisher: async (publisherId, publisherData) => {
    const res = await api.put(
      `/admin/publishers/${publisherId}`,
      publisherData,
    );
    return res.data;
  },
  deletePublisher: async (publisherId) => {
    const res = await api.delete(`/admin/publishers/${publisherId}`);
    return res.data;
  },

  // --- SHELVES ---
  listShelves: async () => {
    const res = await api.get("/shelves");
    return res.data;
  },
  createShelf: async (shelfData) => {
    const res = await api.post("/admin/shelves", shelfData);
    return res.data;
  },
  updateShelf: async (shelfId, shelfData) => {
    const res = await api.put(`/admin/shelves/${shelfId}`, shelfData);
    return res.data;
  },
  deleteShelf: async (shelfId) => {
    const res = await api.delete(`/admin/shelves/${shelfId}`);
    return res.data;
  },

  // --- CONFIG (Fines & Borrowing) ---
  getBorrowingConfig: async () => {
    const res = await api.get("/admin/config/borrowing");
    return res.data;
  },
  updateBorrowingConfig: async (borrowingConfigData) => {
    const res = await api.put("/admin/config/borrowing", borrowingConfigData);
    return res.data;
  },
  getFineConfig: async () => {
    const res = await api.get("/admin/config/fines");
    return res.data;
  },
  createFineConfig: async (fineConfigData) => {
    const res = await api.post("/admin/config/fines", fineConfigData);
    return res.data;
  },
  updateFineConfigById: async (configId, fineConfigData) => {
    const res = await api.put(`/admin/config/fines/${configId}`, fineConfigData);
    return res.data;
  },
  deleteFineConfig: async (configId) => {
    const res = await api.delete(`/admin/config/fines/${configId}`);
    return res.data;
  },
  updateFineConfig: async (fineConfigData) => {
    const res = await api.put("/admin/config/fines", fineConfigData);
    return res.data;
  },

  // --- SYSTEM LOGS ---
  listSystemLogs: async () => {
    const res = await api.get("/admin/system-logs");
    return res.data;
  },
};

export default adminService;
