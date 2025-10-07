/**
 * Página 404 - No Encontrada
 */

import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          Página No Encontrada
        </h2>

        <p className="text-secondary-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Volver Atrás
          </Button>

          <Button
            onClick={() => navigate("/dashboard")}
            variant="primary"
            leftIcon={<Home className="w-5 h-5" />}
          >
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
