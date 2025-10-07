import { useEffect } from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Plus,
  Calendar,
  Activity,
  Target,
  CreditCard,
  Package,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatNumber } from "@/utils/helpers";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { setPageTitle } = useUIStore();

  useEffect(() => {
    setPageTitle("Dashboard");
  }, [setPageTitle]);

  // Datos de ejemplo mejorados
  const stats = [
    {
      id: 1,
      name: "Ventas Totales",
      value: "$125,430",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "success",
      description: "Últimos 30 días",
    },
    {
      id: 2,
      name: "Clientes Nuevos",
      value: "245",
      change: "+8.2%",
      changeType: "increase",
      icon: Users,
      color: "primary",
      description: "Este mes",
    },
    {
      id: 3,
      name: "Pedidos",
      value: "1,234",
      change: "-2.4%",
      changeType: "decrease",
      icon: ShoppingCart,
      color: "warning",
      description: "Vs mes anterior",
    },
    {
      id: 4,
      name: "Tasa de Conversión",
      value: "3.24%",
      change: "+0.5%",
      changeType: "increase",
      icon: TrendingUp,
      color: "primary",
      description: "Ratio de ventas",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      customer: "Juan Pérez",
      product: "Producto A - Premium",
      amount: 1250,
      status: "completed",
      date: "2024-01-15",
      items: 2,
    },
    {
      id: 2,
      customer: "María García",
      product: "Producto B - Básico",
      amount: 850,
      status: "pending",
      date: "2024-01-15",
      items: 1,
    },
    {
      id: 3,
      customer: "Carlos López",
      product: "Producto C - Enterprise",
      amount: 2100,
      status: "processing",
      date: "2024-01-14",
      items: 3,
    },
    {
      id: 4,
      customer: "Ana Martínez",
      product: "Producto D - Standard",
      amount: 650,
      status: "completed",
      date: "2024-01-14",
      items: 1,
    },
    {
      id: 5,
      customer: "Luis Rodríguez",
      product: "Producto E - Premium",
      amount: 1800,
      status: "cancelled",
      date: "2024-01-13",
      items: 2,
    },
  ];

  const quickActions = [
    {
      id: 1,
      name: "Nuevo Cliente",
      description: "Agregar un nuevo cliente al CRM",
      icon: Users,
      color: "primary",
      path: "/customers/new",
    },
    {
      id: 2,
      name: "Nuevo Pedido",
      description: "Crear un pedido para un cliente",
      icon: ShoppingCart,
      color: "success",
      path: "/orders/new",
    },
    {
      id: 3,
      name: "Nueva Factura",
      description: "Generar una factura para un pedido",
      icon: CreditCard,
      color: "warning",
      path: "/invoices/new",
    },
  ];

  const statusVariants = {
    completed: "success",
    pending: "warning",
    processing: "info",
    cancelled: "danger",
  };

  const statusLabels = {
    completed: "Completado",
    pending: "Pendiente",
    processing: "Procesando",
    cancelled: "Cancelado",
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: "✅",
      pending: "⏳",
      processing: "🔄",
      cancelled: "❌",
    };
    return icons[status] || "●";
  };

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      {/* Welcome Section Mejorada */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            ¡Bienvenido, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Aquí tienes un resumen de tu negocio hoy
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
            <Calendar className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid Mejorada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id} hover glow className="relative overflow-hidden">
              {/* Efecto de gradiente sutil */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 rounded-full -translate-y-10 translate-x-10`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          stat.changeType === "increase"
                            ? "bg-success-100 text-success-700"
                            : "bg-danger-100 text-danger-700"
                        }`}
                      >
                        {stat.changeType === "increase" ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {stat.change}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Más Ancho */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <Card.Title>Pedidos Recientes</Card.Title>
                  <Card.Description>
                    Últimos pedidos realizados en tu tienda
                  </Card.Description>
                </div>
                <button className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200 group">
                  Ver todos
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </Card.Header>

            <Card.Content className="p-0">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Cliente & Producto
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/60">
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer group"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                              {order.customer}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {order.product}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {order.items}{" "}
                              {order.items === 1 ? "artículo" : "artículos"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString("es-ES")}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(order.amount)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <span className="mr-2 text-sm">
                              {getStatusIcon(order.status)}
                            </span>
                            <Badge
                              variant={statusVariants[order.status]}
                              className="text-xs"
                            >
                              {statusLabels[order.status]}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Acciones Rápidas</Card.Title>
              <Card.Description>Tareas frecuentes</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group bg-white"
                  >
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 text-left flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {action.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                );
              })}
            </Card.Content>
          </Card>

          {/* Performance Metric */}
          <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <Card.Content className="text-center p-6">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">
                Rendimiento Mensual
              </h3>
              <div className="text-3xl font-bold mb-2">94.2%</div>
              <p className="text-primary-100 text-sm">
                Objetivos cumplidos este mes
              </p>
              <div className="mt-4 w-full bg-primary-400/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: "94.2%" }}
                ></div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Metrics Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">
                  Clientes Activos
                </p>
                <p className="text-2xl font-bold mt-1">1,248</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+5.2% este mes</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-slate-400/60" />
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-100 text-sm font-medium">
                  Ingresos Netos
                </p>
                <p className="text-2xl font-bold mt-1">$89,420</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-white mr-1" />
                  <span className="text-success-100 text-sm">
                    +12.8% vs mes anterior
                  </span>
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-white/60" />
            </div>
          </Card.Content>
        </Card>

        <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warning-100 text-sm font-medium">
                  Pedidos Pendientes
                </p>
                <p className="text-2xl font-bold mt-1">24</p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-white mr-1" />
                  <span className="text-warning-100 text-sm">
                    Necesitan atención
                  </span>
                </div>
              </div>
              <Package className="h-12 w-12 text-white/60" />
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
