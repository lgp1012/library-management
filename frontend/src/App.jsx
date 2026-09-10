import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import EmployeePage from "./pages/EmployeePage.jsx";
import ReaderPage from "./pages/ReaderPage.jsx";
import SigninPage from "./pages/SigninPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/dashboard" element={<AdminPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
        <Route path="/employee/dashboard" element={<EmployeePage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["READER"]} />}>
        <Route path="/reader/dashboard" element={<ReaderPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
