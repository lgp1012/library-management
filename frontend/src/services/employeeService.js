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
  addBookCopy: async (bookId, shelfId) => {
    const res = await api.post(
      `/employees/books/${bookId}/copies${shelfId ? `?shelfId=${shelfId}` : ""}`,
    );
    return res.data;
  },
  deleteBookCopy: async (copyId) => {
    const res = await api.delete(`/employees/copies/${copyId}`);
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
  renewBorrowing: async (detailId, demoDelayMs = 0) => {
    const res = await api.patch(
      `/employees/borrowings/${detailId}/renew${demoDelayMs ? `?demoDelayMs=${demoDelayMs}` : ""}`,
    );
    return res.data;
  },

  // --- FINES ---
  getAllFines: async () => {
    const res = await api.get("/employees/fines");
    return res.data;
  },
  getFines: async (readerId, demoNoLock = false) => {
    const res = await api.get(
      `/employees/fines/readers/${readerId}${demoNoLock ? "?demoNoLock=true" : ""}`,
    );
    return res.data;
  },
  getFineConfigs: async () => {
    const res = await api.get("/employees/fines/config");
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
  createFine: async (data, demoDelayMs = 0, demoAutoRollback = false) => {
    const params = new URLSearchParams();
    if (demoDelayMs) params.set("demoDelayMs", demoDelayMs);
    if (demoAutoRollback) params.set("demoAutoRollback", "true");
    const qs = params.toString();
    const res = await api.post(`/employees/fines${qs ? `?${qs}` : ""}`, data);
    return res.data;
  },
  deleteFine: async (fineId) => {
    const res = await api.delete(`/employees/fines/${fineId}`);
    return res.data;
  },
  collectFine: async (fineId) => {
    const res = await api.put(`/employees/fines/${fineId}/collect`);
    return res.data;
  },
  startShelfAudit: async (shelfId) => {
    const res = await api.post(`/inventory-audit/shelf/start?shelfId=${shelfId}`);
    return res.data;
  },
  recountShelfAudit: async (auditId) => {
    const res = await api.post(`/inventory-audit/shelf/${auditId}/recount`);
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

  // --- REPORTS (dùng các view CSDL: vw_OverdueReaders, vw_BookCatalogDetail, vw_AvailableBooks, vw_ReaderBorrowingHistory) ---
  getOverdueReaders: async () => {
    const res = await api.get("/employees/reports/overdue");
    return res.data;
  },
  searchCatalog: async (keyword) => {
    const res = await api.get(`/employees/reports/catalog-search?q=${encodeURIComponent(keyword || "")}`);
    return res.data;
  },
  getAvailableLocations: async (bookId) => {
    const res = await api.get(`/employees/reports/available-locations?bookId=${bookId}`);
    return res.data;
  },
  getReaderHistory: async (readerId) => {
    const res = await api.get(`/employees/reports/readers/${readerId}/history`);
    return res.data;
  },
};

export default employeeService;
