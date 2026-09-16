import api from "../libs/axios";

const readerService = {
  // Get all books for catalog
  listBooks: async () => {
    // Note: Assuming BookController or EmployeeController allows this. 
    // We will use the existing reference data or a new endpoint if needed.
    const res = await api.get("/books"); 
    return res.data;
  },

  // Get current reader profile
  getProfile: async () => {
    const res = await api.get("/readers/me");
    return res.data;
  },

  // Get current reader borrowings
  getMyBorrowings: async () => {
    const res = await api.get("/readers/me/borrowings");
    return res.data;
  },

  listShelves: async () => {
    const res = await api.get("/shelves");
    return res.data;
  },

  listAuthors: async () => {
    const res = await api.get("/authors");
    return res.data;
  },

  reserveBook: async (bookId) => {
    const res = await api.post("/readers/me/reservations", { bookId });
    return res.data;
  },

  listReservations: async () => {
    const res = await api.get("/readers/me/reservations");
    return res.data;
  },

  cancelReservation: async (reservationId) => {
    const res = await api.patch(`/readers/me/reservations/${reservationId}/cancel`);
    return res.data;
  },

  getBorrowingConfig: async () => {
    const res = await api.get("/config/borrowing");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put("/readers/me", data);
    return res.data;
  },

  getMyFines: async () => {
    const res = await api.get("/readers/me/fines");
    return res.data;
  }
};

export default readerService;
