import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";
import EmployeePage from "./pages/employee/EmployeePage.jsx";
import ReaderDashboard from "./pages/reader/ReaderDashboard.jsx";
import BorrowedBooksPage from "./pages/reader/BorrowedBooksPage.jsx";
import ReservationPage from "./pages/reader/ReservationPage.jsx";
import HistoryPage from "./pages/reader/HistoryPage.jsx";
import SigninPage from "./pages/SigninPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

const isReaderPreview =
  import.meta.env.DEV && import.meta.env.VITE_READER_PREVIEW === "true";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/dashboard" element={<AdminPage />} />
      </Route>

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
        <Route path="/employee/dashboard" element={<EmployeePage />} />
      </Route>

      {/* Reader Routes */}
      {isReaderPreview ? (
        <>
          <Route path="/reader/dashboard" element={<ReaderDashboard />} />
          <Route path="/reader/borrowed" element={<BorrowedBooksPage />} />
          <Route path="/reader/reservations" element={<ReservationPage />} />
          <Route path="/reader/history" element={<HistoryPage />} />
        </>
      ) : (
        <Route element={<ProtectedRoute allowedRoles={["READER"]} />}>
          <Route path="/reader/dashboard" element={<ReaderDashboard />} />
          <Route path="/reader/borrowed" element={<BorrowedBooksPage />} />
          <Route path="/reader/reservations" element={<ReservationPage />} />
          <Route path="/reader/history" element={<HistoryPage />} />
        </Route>
      )}

      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
