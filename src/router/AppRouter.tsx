import { Routes, Route } from "react-router";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { DashboardLayout } from "../pages/dashboard/DashboardLayout";
import { RoleProtectedRoute } from "./RoleProtectedRoute";
import { AdminPage } from "../pages/dashboard/admin/AdminPage";
import { ManagerPage } from "../pages/dashboard/manager/ManagerPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="admin" element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
            </RoleProtectedRoute>
        } />
        <Route path="manager" element={
            <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
                <ManagerPage />
            </RoleProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
