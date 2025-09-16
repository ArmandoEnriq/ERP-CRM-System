// Hook personalizado para formularios con react-hook-form
// QUÉ HACE: Wrapper de react-hook-form con validaciones Yup
// PARA QUÉ:
// - Manejo automático de validaciones
// - Error handling del servidor
// - Loading states
// - Integration con toast notifications

import { useForm as useReactHookForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import toast from "react-hot-toast";

export const useForm = ({
  schema,
  defaultValues = {},
  onSubmit,
  onError,
  mode = "onChange",
}) => {
  const form = useReactHookForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
    mode,
  });

  const handleSubmit = useCallback(
    async (data) => {
      try {
        if (onSubmit) {
          await onSubmit(data);
        }
      } catch (error) {
        // Manejar errores de validación del servidor
        if (error.response?.data?.errors) {
          const serverErrors = error.response.data.errors;

          // Si son errores de campo específicos
          if (Array.isArray(serverErrors)) {
            serverErrors.forEach((err) => {
              if (err.field) {
                form.setError(err.field, { message: err.message });
              } else {
                toast.error(err.message);
              }
            });
          } else if (typeof serverErrors === "object") {
            // Si es un objeto con campos
            Object.entries(serverErrors).forEach(([field, message]) => {
              form.setError(field, { message });
            });
          }
        } else {
          // Error general
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Error inesperado";
          toast.error(errorMessage);
        }

        if (onError) {
          onError(error);
        }
      }
    },
    [form, onSubmit, onError]
  );

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),

    // Helper methods
    setFieldValue: (name, value) => form.setValue(name, value),
    getFieldError: (name) => form.formState.errors[name]?.message,
    isFieldInvalid: (name) => !!form.formState.errors[name],
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
  };
};
