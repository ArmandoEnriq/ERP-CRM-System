/**
 * Página de Recuperación de Contraseña
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import useAuthStore from "../../store/auth.store";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuthStore();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
      toast.success("Correo enviado exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al enviar correo");
    }
  };

  if (emailSent) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success-600" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Correo Enviado
          </h1>
          <p className="text-secondary-600">
            Hemos enviado un enlace de recuperación a tu correo electrónico. Por
            favor revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/login">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Volver al Login
            </Button>
          </Link>

          <button
            onClick={() => setEmailSent(false)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            ¿No recibiste el correo? Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Recuperar Contraseña
        </h1>
        <p className="text-secondary-600">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register("email", {
            required: "El correo es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Correo inválido",
            },
          })}
        />

        {/* Submit button */}
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Enviar Enlace de Recuperación
        </Button>

        {/* Back to login */}
        <Link to="/login">
          <Button
            type="button"
            variant="ghost"
            fullWidth
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Volver al Login
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
