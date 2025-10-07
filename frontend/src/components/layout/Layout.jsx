import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { cn } from "@/utils/helpers";
import { useUIStore } from "@/store/ui.store";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300 min-h-screen",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
