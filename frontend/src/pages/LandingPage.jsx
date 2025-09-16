import { Link } from "react-router-dom"; // para uso de rutas
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"; // para uso de iconos

export default function LandingPage() {
  return (
    <div
      name="container_principal"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
    >
      {/* altura minima 100vh, fondo gradiente de azul a blanco a morado */}
      {/* Header */}
      <header className="bg-white shadow-sm">
        {" "}
        {/* fondo blanco y sombra */}
        <div
          name="container_header"
          className="container mx-auto px-4 py-4 flex items-center justify-between"
        >
          {" "}
          {/* contenedor responsiv centrado con padding horizontal y vertical 4px , flex , items centrados y espacio entre items  */}
          <div name="item_logo" className="flex items-center space-x-2">
            {" "}
            {/* flex , items centrados y espacio entre items horizontales de 2px  */}
            <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />{" "}
            {/* icono alto 8px ancho 8px y color primario */}
            <h1 className="text-2xl font-bold text-gray-900">
              {import.meta.env.VITE_APP_NAME || "ERP/CRM System"}
            </h1>{" "}
            {/* texto 2xl (24px) negrita y color gris 900/ importamos el nombre de la app de env */}
          </div>
          <nav className="hidden md:flex space-x-6">
            {" "}
            {/* oculto en dispositivos moviles y flex , espacio entre items 6px */}
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              {" "}
              {/* texto gris 600 y hover color primario  */}
              Inicio
            </Link>
            <Link
              to="#features"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Características
            </Link>
            <Link
              to="#contact"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Contacto
            </Link>
          </nav>
        </div>
      </header>
      {/* Hero Section */}
      <section className="py-20">
        <div name="container_central" className="container text-center">
          <h2 className="text-5xl  font-bold text-gray-900 mb-7 ">
            Sistema ERP/CRM
            <span className="text-primary-600 block">Todo en Uno</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gestiona tu empresa de manera eficiente con nuestro sistema
            integrado de planificación de recursos empresariales y gestión de
            relaciones con clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn">Comenzar Demo</button>
            <button className="btn">Ver Características</button>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Características Principales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* CRM */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Gestión de Clientes
              </h4>
              <p className="text-gray-600">
                Administra leads, clientes y oportunidades de venta de manera
                eficiente.
              </p>
            </div>

            {/* ERP */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCartIcon className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Control de Inventario
              </h4>
              <p className="text-gray-600">
                Gestiona productos, pedidos, facturación y contabilidad en un
                solo lugar.
              </p>
            </div>

            {/* Reports */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-warning-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Reportes Avanzados
              </h4>
              <p className="text-gray-600">
                Obtén insights valiosos con reportes detallados y dashboards
                interactivos.
              </p>
            </div>

            {/* Integration */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOfficeIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Multi-empresa
              </h4>
              <p className="text-gray-600">
                Maneja múltiples empresas y sucursales desde una sola
                plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container text-center">
          <p>&copy; 2024 ERP/CRM System. Desarrollado con React + NestJS.</p>
          <p className="text-gray-400 mt-2">
            Versión: {import.meta.env.VITE_APP_VERSION || "1.0.0"} | Entorno:{" "}
            {import.meta.env.VITE_NODE_ENV || "development"}
          </p>
        </div>
      </footer>
    </div>
  );
}
