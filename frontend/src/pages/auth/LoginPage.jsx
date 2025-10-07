import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema } from "@/utils/validators";
import { ROUTES } from "@/utils/constants";
import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Mostrar mensaje si la sesión expiró
  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      toast.error(
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        {
          duration: 6000,
          icon: "⏰",
        }
      );
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("¡Bienvenido de nuevo! 👋", {
        icon: "🎉",
      });
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión", {
        icon: "❌",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-lg shadow-primary-500/25">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text">
            ERP/CRM System
          </h1>
          <p className="text-gray-300 text-lg">Inicia sesión en tu cuenta</p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/95 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@empresa.com"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Password */}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors group-hover:border-primary-400"
                  {...register("rememberMe")}
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Recordarme
                </span>
              </label>

              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
              >
                Regístrate aquí
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

export default LoginPage;
