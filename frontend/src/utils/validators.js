import * as yup from "yup";
import { VALIDATION } from "./constants";

// Mensajes de error personalizados en español
yup.setLocale({
  mixed: {
    required: "Este campo es obligatorio",
    notType: "Formato inválido",
  },
  string: {
    email: "Correo electrónico inválido",
    min: "Debe tener al menos ${min} caracteres",
    max: "Debe tener máximo ${max} caracteres",
    matches: "Formato inválido",
  },
  number: {
    min: "Debe ser mayor o igual a ${min}",
    max: "Debe ser menor o igual a ${max}",
    positive: "Debe ser un número positivo",
  },
});

// Schema de validación para login
export const loginSchema = yup.object({
  email: yup.string().required().email().trim(),
  password: yup.string().required().min(VALIDATION.PASSWORD_MIN_LENGTH),
  rememberMe: yup.boolean(),
});

// Schema de validación para registro
export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres")
    .trim(),
  lastName: yup
    .string()
    .required("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido debe tener máximo 50 caracteres")
    .trim(),
  email: yup.string().required().email().trim(),
  password: yup
    .string()
    .required()
    .min(VALIDATION.PASSWORD_MIN_LENGTH)
    .matches(
      VALIDATION.PASSWORD_PATTERN,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
    ),
  confirmPassword: yup
    .string()
    .required("Confirma tu contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
  companyName: yup
    .string()
    .required("El nombre de la empresa es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener máximo 100 caracteres")
    .trim(),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones"),
});

// Schema de validación para cambio de contraseña
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("La contraseña actual es obligatoria"),
  newPassword: yup
    .string()
    .required("La nueva contraseña es obligatoria")
    .min(VALIDATION.PASSWORD_MIN_LENGTH)
    .matches(
      VALIDATION.PASSWORD_PATTERN,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
    )
    .notOneOf(
      [yup.ref("currentPassword")],
      "La nueva contraseña debe ser diferente a la actual"
    ),
  confirmNewPassword: yup
    .string()
    .required("Confirma tu nueva contraseña")
    .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden"),
});

// Schema de validación para recuperar contraseña
export const forgotPasswordSchema = yup.object({
  email: yup.string().required().email().trim(),
});

// Schema de validación para resetear contraseña
export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required()
    .min(VALIDATION.PASSWORD_MIN_LENGTH)
    .matches(
      VALIDATION.PASSWORD_PATTERN,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
    ),
  confirmPassword: yup
    .string()
    .required("Confirma tu contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});

// Schema de validación para perfil de usuario
export const userProfileSchema = yup.object({
  firstName: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres")
    .trim(),
  lastName: yup
    .string()
    .required("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido debe tener máximo 50 caracteres")
    .trim(),
  email: yup.string().required().email().trim(),
  phone: yup
    .string()
    .nullable()
    .matches(VALIDATION.PHONE_PATTERN, "Teléfono inválido"),
  position: yup
    .string()
    .nullable()
    .max(100, "El puesto debe tener máximo 100 caracteres"),
});

// Schema de validación para crear/editar usuario
export const userFormSchema = yup.object({
  firstName: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres")
    .trim(),
  lastName: yup
    .string()
    .required("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido debe tener máximo 50 caracteres")
    .trim(),
  email: yup.string().required().email().trim(),
  role: yup
    .string()
    .required("El rol es obligatorio")
    .oneOf(["super_admin", "admin", "manager", "user"], "Rol inválido"),
  status: yup
    .string()
    .required("El estado es obligatorio")
    .oneOf(["active", "inactive", "pending", "suspended"], "Estado inválido"),
  phone: yup
    .string()
    .nullable()
    .matches(VALIDATION.PHONE_PATTERN, "Teléfono inválido"),
  position: yup
    .string()
    .nullable()
    .max(100, "El puesto debe tener máximo 100 caracteres"),
  companyId: yup.string().nullable(),
});

// Schema de validación para empresa
export const companyFormSchema = yup.object({
  name: yup
    .string()
    .required("El nombre de la empresa es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener máximo 100 caracteres")
    .trim(),
  tradeName: yup
    .string()
    .nullable()
    .max(100, "El nombre comercial debe tener máximo 100 caracteres")
    .trim(),
  rfc: yup
    .string()
    .required("El RFC es obligatorio")
    .matches(VALIDATION.RFC_PATTERN, "RFC inválido")
    .trim()
    .uppercase(),
  status: yup
    .string()
    .required("El estado es obligatorio")
    .oneOf(["active", "inactive", "suspended", "trial"], "Estado inválido"),
  size: yup
    .string()
    .required("El tamaño de la empresa es obligatorio")
    .oneOf(["small", "medium", "large", "enterprise"], "Tamaño inválido"),
  street: yup
    .string()
    .required("La calle es obligatoria")
    .max(200, "La calle debe tener máximo 200 caracteres"),
  city: yup
    .string()
    .required("La ciudad es obligatoria")
    .max(100, "La ciudad debe tener máximo 100 caracteres"),
  state: yup
    .string()
    .required("El estado es obligatorio")
    .max(100, "El estado debe tener máximo 100 caracteres"),
  postalCode: yup
    .string()
    .required("El código postal es obligatorio")
    .matches(VALIDATION.POSTAL_CODE_PATTERN, "Código postal inválido"),
  country: yup
    .string()
    .required("El país es obligatorio")
    .max(100, "El país debe tener máximo 100 caracteres"),
  phone: yup
    .string()
    .nullable()
    .matches(VALIDATION.PHONE_PATTERN, "Teléfono inválido"),
  email: yup.string().nullable().email(),
  website: yup.string().nullable().url("URL inválida"),
  plan: yup
    .string()
    .required("El plan es obligatorio")
    .oneOf(["free", "basic", "professional", "enterprise"], "Plan inválido"),
  maxUsers: yup
    .number()
    .required("El número máximo de usuarios es obligatorio")
    .min(1, "Debe permitir al menos 1 usuario")
    .max(999, "El máximo es 999 usuarios"),
});

// Función helper para validar un formulario completo
export const validateForm = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
    return { isValid: false, errors };
  }
};

// Función helper para validar un campo específico
export const validateField = async (schema, fieldName, value) => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};
