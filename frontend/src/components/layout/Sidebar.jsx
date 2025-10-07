import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Contact,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { SIDEBAR_ITEMS, ROUTES } from "@/utils/constants";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

const iconMap = {
  LayoutDashboard,
  Users,
  Building2,
  Contact,
  Package,
  BarChart3,
  Settings,
};

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen, sidebarCollapsed, toggleSidebarCollapsed } =
    useUIStore();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const hasAccess = (roles) => {
    if (!roles || roles.length === 0) return true;
    return roles.includes(user?.role);
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const renderMenuItem = (item) => {
    if (!hasAccess(item.roles)) return null;

    const Icon = iconMap[item.icon];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.label];
    const active = item.path && isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.label} className="mb-1">
          <button
            onClick={() => toggleItem(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
              "hover:bg-gray-100 text-gray-700"
            )}
          >
            <div className="flex items-center">
              {Icon && <Icon className="h-5 w-5 mr-3" />}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
            {!sidebarCollapsed &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ))}
          </button>

          {isExpanded && !sidebarCollapsed && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => {
                if (!hasAccess(child.roles)) return null;
                const childActive = isActive(child.path);

                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "block px-4 py-2 text-sm rounded-lg transition-colors",
                      childActive
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1",
          active
            ? "bg-primary-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        )}
        title={sidebarCollapsed ? item.label : ""}
      >
        {Icon && <Icon className="h-5 w-5" />}
        {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
      </Link>
    );
  };

  if (!sidebarOpen) return null;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
        <Link to={ROUTES.DASHBOARD} className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          {!sidebarCollapsed && (
            <span className="ml-3 text-xl font-bold text-gray-900">
              ERP/CRM
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
        {SIDEBAR_ITEMS.map(renderMenuItem)}
      </nav>

      {/* Toggle Collapse Button */}
      <button
        onClick={toggleSidebarCollapsed}
        className="absolute bottom-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={sidebarCollapsed ? "Expandir" : "Contraer"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600 transform rotate-270" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
