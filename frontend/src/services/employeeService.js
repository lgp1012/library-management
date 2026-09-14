import api from "../libs/axios";

const employeeService = {
  // --- READERS ---
  listReaders: async () => {
    const res = await api.get("/employees/readers");
    return res.data;
  },
  createReader: async (data) => {
    const res = await api.post("/employees/readers", data);
    return res.data;
  },
  updateReader: async (id, data) => {
    const res = await api.put(`/employees/readers/${id}`, data);
    return res.data;
  },
  deactivateReader: async (id) => {
    const res = await api.put(`/employees/readers/${id}/deactivate`);
    return res.data;
  },

  // --- BOOKS ---
  listBooks: async () => {
    const res = await api.get("/employees/books");
    return res.data;
  },
  createBook: async (data) => {
    const res = await api.post("/employees/books", data);
    return res.data;
  },
  updateBook: async (id, data) => {
    const res = await api.put(`/employees/books/${id}`, data);
    return res.data;
  },
  deleteBook: async (id) => {
    const res = await api.delete(`/employees/books/${id}`);
    return res.data;
  },

  // --- INVENTORY ---
  updateInventory: async (data) => {
    // InventoryItemRequest requires: copyId, status, shelfId
    const res = await api.put("/employees/inventory", data);
    return res.data;
  },

  // --- BORROW/RETURN ---
  borrowBooks: async (data) => {
    const res = await api.post("/employees/borrowings", data);
    return res.data;
  },
  returnBook: async (data) => {
    const res = await api.post("/employees/returns", data);
    return res.data;
  },
  renewBorrowing: async (detailId) => {
    const res = await api.patch(`/employees/borrowings/${detailId}/renew`);
    return res.data;
  },

  // --- FINES ---
  getAllFines: async () => {
    const res = await api.get("/employees/fines");
    return res.data;
  },
  getFines: async (readerId) => {
    const res = await api.get(`/employees/fines/readers/${readerId}`);
    return res.data;
  },
  getReaderBorrowings: async (readerId) => {
    const res = await api.get(`/employees/readers/${readerId}/borrowings`);
    return res.data;
  },
  getAllActiveBorrowings: async () => {
    const res = await api.get("/employees/borrowings/active");
    return res.data;
  },
  createFine: async (data) => {
    const res = await api.post("/employees/fines", data);
    return res.data;
  },
  collectFine: async (fineId) => {
    const res = await api.put(`/employees/fines/${fineId}/collect`);
    return res.data;
  },

  // --- RESERVATIONS ---
  getPendingReservations: async () => {
    const res = await api.get("/employees/reservations/pending");
    return res.data;
  },
  processReservation: async (id, data) => {
    const res = await api.put(`/employees/reservations/${id}/process`, data);
    return res.data;
  },
  expireReservations: async () => {
    const res = await api.post("/employees/reservations/expire");
    return res.data;
  },

  // --- METADATA (DROPDOWNS) ---
  getCategories: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
  getAuthors: async () => {
    const res = await api.get("/authors");
    return res.data;
  },
  getPublishers: async () => {
    const res = await api.get("/publishers");
    return res.data;
  },
  getShelves: async () => {
    const res = await api.get("/shelves");
    return res.data;
  },
};

export default employeeService;
