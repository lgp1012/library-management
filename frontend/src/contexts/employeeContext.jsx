import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import employeeService from "../services/employeeService";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employeeProfile] = useState({
    name: "Employee",
    role: "Thủ thư",
    avatar: "",
  });

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [shelves, setShelves] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployeeData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookRes, catRes, authorRes, pubRes, shelfRes] =
        await Promise.allSettled([
          employeeService.listBooks(),
          employeeService.getCategories(),
          employeeService.getAuthors(),
          employeeService.getPublishers(),
          employeeService.getShelves(),
        ]);

      if (bookRes.status === "fulfilled") setBooks(bookRes.value?.result || []);
      if (catRes.status === "fulfilled") setCategories(catRes.value?.result || []);
      if (authorRes.status === "fulfilled") setAuthors(authorRes.value?.result || []);
      if (pubRes.status === "fulfilled") setPublishers(pubRes.value?.result || []);
      if (shelfRes.status === "fulfilled") setShelves(shelfRes.value?.result || []);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  // Methods to refresh data
  const refreshBooks = async () => {
    try {
      const res = await employeeService.listBooks();
      if (res?.result) setBooks(res.result);
    } catch (error) {
      console.error("Failed to refresh books:", error);
    }
  };

  const value = useMemo(
    () => ({
      employeeProfile,
      books,
      categories,
      authors,
      publishers,
      shelves,
      isLoading,
      refreshBooks,
    }),
    [employeeProfile, books, categories, authors, publishers, shelves, isLoading]
  );

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContext;
