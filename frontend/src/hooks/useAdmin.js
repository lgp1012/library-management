// src/hooks/useAdmin.js
import { useContext } from "react";
import AdminContext from "../contexts/adminContext";

export const useAdmin = () => {
  const context = useContext(AdminContext);

  // Bắt lỗi nếu lỡ gọi hook này ở Component không được bọc bởi AdminProvider
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
};
