import { Navigate, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
