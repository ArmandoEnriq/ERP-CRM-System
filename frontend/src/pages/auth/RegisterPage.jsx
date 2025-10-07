import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Lock, User, Building2, Eye, EyeOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import { registerSchema } from "@/utils/validators";
import { ROUTES } from "@/utils/constants";
import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      acceptTerms: false,
    },
  });

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      // Remover confirmPassword antes de enviar
      const { confirmPassword, acceptTerms, ...registerData } = data;
      console.log(registerData);
      await registerUser(registerData);
      toast.success("¡Cuenta creada exitosamente! 🎉", {
        icon: "✅",
        duration: 5000,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error.message || "Error al registrarse", {
        icon: "❌",
      });
    }
  };

  // Validaciones de contraseña en tiempo real
  const passwordValidations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-lg shadow-primary-500/25">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text ">
            Crear Cuenta
          </h1>
          <p className="text-gray-300 text-lg">
            Comienza tu prueba gratuita hoy
          </p>
        </div>

        {/* Register Card */}
        <Card className="backdrop-blur-sm bg-white/95 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Nombre"
                placeholder="Juan"
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
                error={errors.firstName?.message}
                {...register("firstName")}
              />

              <Input
                label="Apellido"
                placeholder="Pérez"
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            {/* Email */}
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@empresa.com"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Empresa */}
            <Input
              label="Nombre de la Empresa"
              placeholder="Mi Empresa S.A. de C.V."
              leftIcon={<Building2 className="h-5 w-5 text-gray-400" />}
              error={errors.companyName?.message}
              {...register("companyName")}
            />

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                  rightAction={true}
                  error={errors.password?.message}
                  {...register("password")}
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Requisitos de contraseña:
                    </p>
                    {Object.entries(passwordValidations).map(
                      ([key, isValid]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              isValid ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            {isValid && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-xs ${
                              isValid
                                ? "text-green-600 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {key === "minLength" && "Mínimo 8 caracteres"}
                            {key === "hasUpperCase" && "1 letra mayúscula"}
                            {key === "hasLowerCase" && "1 letra minúscula"}
                            {key === "hasNumber" && "1 número"}
                            {key === "hasSpecialChar" && "1 carácter especial"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div>
                <Input
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                  rightAction={true}
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />

                {/* Password Match Indicator */}
                {watch("confirmPassword") && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        watch("confirmPassword") === password
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        watch("confirmPassword") === password
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {watch("confirmPassword") === password
                        ? "Las contraseñas coinciden"
                        : "Las contraseñas no coinciden"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
              <label className="flex items-start group cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register("acceptTerms")}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-focus:border-primary-500 peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all duration-200 flex items-center justify-center group-hover:border-primary-400">
                    <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Acepto los{" "}
                  <Link
                    to="/terms"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
                  >
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
                  >
                    política de privacidad
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-2 text-sm text-danger-500 font-medium animate-pulse">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-base font-semibold py-3.5"
            >
              Crear Cuenta
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8 backdrop-blur-sm bg-black/20 rounded-lg py-3 px-4 border border-white/10">
          © 2025 ERP/CRM System. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
