import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "./utils/constants";

// Layouts
import Layout from "./components/layout/Layout";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

// Protected Route Component
import ProtectedRoute from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  // Public Routes
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },

  // Protected Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      // Aquí irán las demás rutas protegidas
      // Users
      // {
      //   path: ROUTES.USERS,
      //   element: <UsersPage />
      // },
      // Companies
      // {
      //   path: ROUTES.COMPANIES,
      //   element: <CompaniesPage />
      // },
      // Profile
      // {
      //   path: ROUTES.PROFILE,
      //   element: <ProfilePage />
      // },
      // Settings
      // {
      //   path: ROUTES.SETTINGS,
      //   element: <SettingsPage />
      // },
    ],
  },

  // 404 Route
  {
    path: "*",
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
]);

export default router;
