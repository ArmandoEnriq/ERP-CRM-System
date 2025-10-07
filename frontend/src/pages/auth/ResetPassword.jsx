/**
 * Página de Resetear Contraseña
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../../store/auth.store";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Token inválido o expirado");
      return;
    }

    try {
      await resetPassword(token, data.password);
      toast.success("Contraseña restablecida exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Error al restablecer contraseña");
    }
  };

  if (!token) {
    return (
      <div className="w-full text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Token Inválido
        </h1>
        <p className="text-secondary-600 mb-6">
          El enlace de recuperación es inválido o ha expirado.
        </p>
        <Button onClick={() => navigate("/forgot-password")} variant="primary">
          Solicitar Nuevo Enlace
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Nueva Contraseña
        </h1>
        <p className="text-secondary-600">Ingresa tu nueva contraseña</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password */}
        <Input
          label="Nueva Contraseña"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-secondary-400 hover:text-secondary-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          hint="Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
          error={errors.password?.message}
          {...register("password", {
            required: "La contraseña es requerida",
            minLength: {
              value: 8,
              message: "Mínimo 8 caracteres",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "La contraseña no cumple con los requisitos",
            },
          })}
        />

        {/* Confirm Password */}
        <Input
          label="Confirmar Contraseña"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-secondary-400 hover:text-secondary-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Confirma tu contraseña",
            validate: (value) =>
              value === password || "Las contraseñas no coinciden",
          })}
        />

        {/* Submit button */}
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Restablecer Contraseña
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
