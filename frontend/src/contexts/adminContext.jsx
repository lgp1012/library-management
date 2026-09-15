import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import adminService from "../services/adminService";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Global States
  const [adminProfile] = useState({
    name: "Admin",
    role: "Quản trị viên",
    avatar: "",
  });
  const [employees, setEmployees] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [borrowingRules, setBorrowingRules] = useState([]);
  const [fineSettings, setFineSettings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [shelves, setShelves] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Hàm tải dữ liệu tổng
  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Dùng Promise.allSettled để nếu 1 API bị lỗi thì các API khác vẫn load bình thường
      const [
        catRes,
        authorRes,
        pubRes,
        shelfRes,
        empRes,
        logRes,
        borrowRes,
        fineRes,
      ] = await Promise.allSettled([
        adminService.listCategories(),
        adminService.listAuthors(),
        adminService.listPublishers(),
        adminService.listShelves(),
        adminService.listEmployees(),
        adminService.listSystemLogs(),
        adminService.getBorrowingConfig(),
        adminService.getFineConfig(),
      ]);

      // 1. Categories
      if (catRes.status === "fulfilled" && catRes.value) {
        const list = Array.isArray(catRes.value.result)
          ? catRes.value.result
          : Array.isArray(catRes.value)
            ? catRes.value
            : [];
        setCategories(
          list.map((c) => ({
            id: c.categoryId,
            categoryId: c.categoryId,
            name: c.categoryName,
            categoryName: c.categoryName,
          })),
        );
      } else if (catRes.status === "rejected") {
        console.error("Lỗi khi tải Categories:", catRes.reason);
      }

      // 2. Authors
      if (authorRes.status === "fulfilled" && authorRes.value) {
        const list = Array.isArray(authorRes.value.result)
          ? authorRes.value.result
          : Array.isArray(authorRes.value)
            ? authorRes.value
            : [];
        setAuthors(
          list.map((a) => ({
            id: a.authorId,
            authorId: a.authorId,
            name: a.authorName,
            authorName: a.authorName,
            dob: a.birthday,
            birthday: a.birthday,
            nationality: a.nationality,
          })),
        );
      } else if (authorRes.status === "rejected") {
        console.error("Lỗi khi tải Authors:", authorRes.reason);
      }

      // 3. Publishers
      if (pubRes.status === "fulfilled" && pubRes.value) {
        const list = Array.isArray(pubRes.value.result)
          ? pubRes.value.result
          : Array.isArray(pubRes.value)
            ? pubRes.value
            : [];
        setPublishers(
          list.map((p) => ({
            id: p.publisherId,
            publisherId: p.publisherId,
            name: p.publisherName,
            publisherName: p.publisherName,
          })),
        );
      } else if (pubRes.status === "rejected") {
        console.error("Lỗi khi tải Publishers:", pubRes.reason);
      }

      // 4. Shelves
      if (shelfRes.status === "fulfilled" && shelfRes.value) {
        const list = Array.isArray(shelfRes.value.result)
          ? shelfRes.value.result
          : Array.isArray(shelfRes.value)
            ? shelfRes.value
            : [];
        setShelves(
          list.map((s) => ({
            id: s.shelfId,
            shelfId: s.shelfId,
            name: s.shelfName,
            shelfName: s.shelfName,
            location: s.position,
            position: s.position,
            shelfLocation: s.position,
            capacity: "N/A",
          })),
        );
      } else if (shelfRes.status === "rejected") {
        console.error("Lỗi khi tải Shelves:", shelfRes.reason);
      }

      // 5. Employees
      if (empRes.status === "fulfilled" && empRes.value) {
        const list = Array.isArray(empRes.value.result)
          ? empRes.value.result
          : Array.isArray(empRes.value)
            ? empRes.value
            : [];
        setEmployees(
          list.map((emp) => ({
            id: emp.employeeId,
            employeeId: emp.employeeId,
            name: emp.employeeName,
            employeeName: emp.employeeName,
            code: emp.employeeId,
            email: emp.email,
            role: "Thủ thư",
            department: emp.address || "",
            status: emp.active ? "Active" : "Inactive",
            permissionsCount: 5,
            lastActive: emp.lastLoginAt ? new Date(emp.lastLoginAt).toLocaleString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            }) : "Chưa ghi nhận",
            initials: emp.employeeName
              ? emp.employeeName.substring(0, 2).toUpperCase()
              : "NV",
          })),
        );
      } else if (empRes.status === "rejected") {
        console.error("Lỗi khi tải Employees:", empRes.reason);
      }

      // 6. Audit Logs
      if (logRes.status === "fulfilled" && logRes.value) {
        const list = Array.isArray(logRes.value.result)
          ? logRes.value.result
          : Array.isArray(logRes.value)
            ? logRes.value
            : [];
        setAuditLogs(
          list.map((log) => ({
            id: log.logId,
            logId: log.logId,
            action: "Hành động hệ thống",
            description: log.logMessage,
            admin: log.createdByUserId || "System",
            time: log.logDate
              ? new Date(log.logDate).toLocaleString("vi-VN")
              : "N/A",
            status: "Success",
          })),
        );
      } else if (logRes.status === "rejected") {
        console.error("Lỗi khi tải Audit Logs:", logRes.reason);
      }

      // 7. Borrowing Rules
      if (
        borrowRes.status === "fulfilled" &&
        borrowRes.value?.result &&
        !Array.isArray(borrowRes.value.result)
      ) {
        setBorrowingRules([borrowRes.value.result]);
      }

      // 8. Fine Settings
      if (fineRes.status === "fulfilled" && fineRes.value) {
        const fineData = fineRes.value?.result ?? fineRes.value;
        if (Array.isArray(fineData)) {
          setFineSettings(fineData);
        } else if (fineData) {
          setFineSettings([fineData]);
        } else {
          setFineSettings([]);
        }
      } else if (fineRes.status === "rejected") {
        console.error("Lỗi khi tải Fine Settings:", fineRes.reason);
        setFineSettings([]);
      }
    } catch (error) {
      console.error("Lỗi khi đồng bộ dữ liệu Admin:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      adminProfile,
      employees,
      setEmployees,
      auditLogs,
      setAuditLogs,
      borrowingRules,
      setBorrowingRules,
      fineSettings,
      setFineSettings,
      categories,
      setCategories,
      authors,
      setAuthors,
      publishers,
      setPublishers,
      shelves,
      setShelves,
      isLoading,
      refreshData: fetchAdminData,
    }),
    [
      adminProfile,
      employees,
      auditLogs,
      borrowingRules,
      fineSettings,
      categories,
      authors,
      publishers,
      shelves,
      isLoading,
      fetchAdminData,
    ],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminData();
  }, [fetchAdminData]);

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContext;
