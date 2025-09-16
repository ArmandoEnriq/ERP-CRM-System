import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        {/* 404 Número */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <div className="relative -mt-16">
            <h2 className="text-2xl font-semibold text-gray-700">
              Página no encontrada
            </h2>
          </div>
        </div>

        {/* Mensaje */}
        <p className="text-gray-600 mb-8 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida. Verifica
          la URL o regresa al inicio.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Ir al Inicio</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-primary inline-flex items-center space-x-2 cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Enlaces útiles:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-800 text-sm"
            >
              Inicio
            </Link>
            <Link
              to="/dashboard"
              className="text-primary-600 hover:text-primary-800 text-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-800 text-sm"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
