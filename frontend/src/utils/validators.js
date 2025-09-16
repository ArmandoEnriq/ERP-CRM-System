// Esquemas de validación con Yup (biblioteca de validación)
// QUÉ HACE: Define todas las validaciones con Yup
// PARA QUÉ:
// - loginSchema: Validar email/password en login
// - registerSchema: Validar registro de usuarios
// - customerSchema: Validar datos de clientes
// - productSchema: Validar productos del inventario
// - orderSchema: Validar pedidos
// - invoiceSchema: Validar facturas
// - Mensajes de error en español

import * as yup from "yup";

// Mensajes de error personalizados
const messages = {
  required: "Este campo es obligatorio",
  email: "Ingresa un email válido",
  min: "Debe tener al menos ${min} caracteres",
  max: "No debe exceder ${max} caracteres",
  phone: "Ingresa un teléfono válido",
  password:
    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
};

// Configuración base de Yup
yup.setLocale({
  mixed: {
    required: messages.required,
  },
  string: {
    email: messages.email,
    min: messages.min,
    max: messages.max,
  },
});

// Validaciones comunes
export const commonValidations = {
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      messages.password
    )
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required(),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, messages.phone)
    .nullable(),
  name: yup.string().min(2).max(50).required(),
  description: yup.string().max(500),
  url: yup.string().url("Ingresa una URL válida").nullable(),
  taxId: yup
    .string()
    .matches(/^[A-Z]{4}\d{6}[A-Z\d]{3}$/, "Formato de RFC inválido")
    .nullable(),
};

// Esquemas de validación

// Auth
export const loginSchema = yup.object({
  email: commonValidations.email,
  password: yup.string().required(),
  rememberMe: yup.boolean(),
});

export const registerSchema = yup.object({
  firstName: commonValidations.name,
  lastName: commonValidations.name,
  email: commonValidations.email,
  password: commonValidations.password,
  confirmPassword: commonValidations.confirmPassword,
  acceptTerms: yup
    .boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones"),
});

export const forgotPasswordSchema = yup.object({
  email: commonValidations.email,
});

export const resetPasswordSchema = yup.object({
  password: commonValidations.password,
  confirmPassword: commonValidations.confirmPassword,
});

// User Profile
export const profileSchema = yup.object({
  firstName: commonValidations.name,
  lastName: commonValidations.name,
  email: commonValidations.email,
  phone: commonValidations.phone,
  avatar: yup.string().nullable(),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: commonValidations.password,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
    .required(),
});

// Company
export const companySchema = yup.object({
  name: yup.string().min(2).max(100).required(),
  taxId: commonValidations.taxId,
  email: commonValidations.email,
  phone: commonValidations.phone,
  website: commonValidations.url,
  address: yup.string().max(200),
  city: yup.string().max(50),
  state: yup.string().max(50),
  zipCode: yup.string().max(10),
  country: yup.string().max(50),
});

// CRM Schemas
export const customerSchema = yup.object({
  firstName: commonValidations.name,
  lastName: commonValidations.name,
  email: commonValidations.email,
  phone: commonValidations.phone,
  company: yup.string().max(100),
  position: yup.string().max(50),
  address: yup.string().max(200),
  notes: commonValidations.description,
  customerType: yup.string().oneOf(["individual", "company"]).required(),
});

export const leadSchema = yup.object({
  firstName: commonValidations.name,
  lastName: commonValidations.name,
  email: commonValidations.email,
  phone: commonValidations.phone,
  company: yup.string().max(100),
  source: yup.string().max(50),
  status: yup
    .string()
    .oneOf(["new", "contacted", "qualified", "converted", "lost"])
    .required(),
  notes: commonValidations.description,
});

// ERP Schemas
export const productSchema = yup.object({
  name: yup.string().min(2).max(100).required(),
  sku: yup.string().min(2).max(50).required(),
  description: commonValidations.description,
  category: yup.string().max(50),
  price: yup.number().positive("El precio debe ser mayor a 0").required(),
  cost: yup.number().positive("El costo debe ser mayor a 0"),
  stock: yup
    .number()
    .integer()
    .min(0, "El stock no puede ser negativo")
    .required(),
  minStock: yup.number().integer().min(0),
  maxStock: yup.number().integer().min(0),
  weight: yup.number().positive(),
  dimensions: yup.string().max(50),
  barcode: yup.string().max(50),
  isActive: yup.boolean(),
});

export const orderSchema = yup.object({
  customerId: yup.string().required(),
  orderDate: yup.date().required(),
  dueDate: yup
    .date()
    .min(
      yup.ref("orderDate"),
      "La fecha de entrega no puede ser anterior a la fecha del pedido"
    ),
  status: yup
    .string()
    .oneOf([
      "draft",
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .required(),
  notes: commonValidations.description,
  discount: yup.number().min(0).max(100),
  tax: yup.number().min(0),
});

export const invoiceSchema = yup.object({
  customerId: yup.string().required(),
  orderId: yup.string().nullable(),
  invoiceDate: yup.date().required(),
  dueDate: yup
    .date()
    .min(
      yup.ref("invoiceDate"),
      "La fecha de vencimiento no puede ser anterior a la fecha de factura"
    ),
  status: yup
    .string()
    .oneOf(["draft", "sent", "paid", "overdue", "cancelled"])
    .required(),
  notes: commonValidations.description,
  discount: yup.number().min(0).max(100),
  tax: yup.number().min(0).required(),
});
