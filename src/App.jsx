import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPanel from "./components/AdminPanel";
import { ToastContainer } from "react-toastify";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" />;
};

const LoginRedirect = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? <Navigate to="/" /> : children;
};

const App = () => {
  return (
    <div className="w-full h-screen flex overflow-hidden">
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginRedirect>
              <LoginPage />
            </LoginRedirect>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
