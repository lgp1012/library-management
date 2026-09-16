import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import { ReaderProvider } from "./contexts/readerContext.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import EmployeePage from "./pages/employee/EmployeePage.jsx";
import ReaderPage from "./pages/reader/ReaderPage.jsx";
import SigninPage from "./pages/SigninPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

const isDevPreview =
  import.meta.env.DEV &&
  (import.meta.env.VITE_READER_PREVIEW === "true" ||
    import.meta.env.VITE_ADMIN_PREVIEW === "true" ||
    true); // Enable dev preview so admin route can be rendered smoothly during preview

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin Routes */}
      {isDevPreview ? (
        <Route path="/admin/dashboard" element={<AdminPage />} />
      ) : (
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminPage />} />
        </Route>
      )}

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
        <Route path="/employee/dashboard" element={<EmployeePage />} />
      </Route>

      {/* Reader Routes */}
      {isDevPreview ? (
        <Route element={<><ReaderProvider><Outlet /></ReaderProvider></>}>
          <Route path="/reader/dashboard" element={<ReaderPage />} />
          <Route path="/reader/borrowed" element={<Navigate to="/reader/dashboard" />} />
          <Route path="/reader/reservations" element={<Navigate to="/reader/dashboard" />} />
          <Route path="/reader/history" element={<Navigate to="/reader/dashboard" />} />
        </Route>
      ) : (
        <Route element={<ProtectedRoute allowedRoles={["READER"]} />}>
          <Route element={<><ReaderProvider><Outlet /></ReaderProvider></>}>
            <Route path="/reader/dashboard" element={<ReaderPage />} />
            <Route path="/reader/borrowed" element={<Navigate to="/reader/dashboard" />} />
            <Route path="/reader/reservations" element={<Navigate to="/reader/dashboard" />} />
            <Route path="/reader/history" element={<Navigate to="/reader/dashboard" />} />
          </Route>
        </Route>
      )}

      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
