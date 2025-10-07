import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      rightAction = false,
      fullWidth = false,
      className = "",
      inputClassName = "",
      type = "text",
      id,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputClasses = cn(
      "w-full border rounded-xl transition-all duration-200",
      "focus:outline-none focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500",
      "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500",
      "placeholder:text-gray-400",
      error
        ? "border-danger-500 focus:ring-danger-500/30 focus:border-danger-500"
        : "border-gray-300 hover:border-gray-400 focus:border-primary-500",
      // Aplicamos padding según los iconos
      !leftIcon && !rightIcon && !rightAction && "px-4 py-3",
      leftIcon && !rightIcon && !rightAction && "pl-12 pr-4 py-3",
      rightIcon && !leftIcon && !rightAction && "pl-4 pr-12 py-3",
      leftIcon && rightIcon && !rightAction && "pl-12 pr-12 py-3",
      // Cuando hay rightAction
      leftIcon && rightAction && "pl-12 pr-12 py-3",
      !leftIcon && rightAction && "pl-4 pr-12 py-3",
      // Estados
      disabled && "opacity-60",
      inputClassName
    );

    const containerClasses = cn(
      "space-y-2 transition-all duration-200",
      fullWidth ? "w-full" : "",
      className
    );

    const labelClasses = cn(
      "block text-sm font-semibold transition-colors duration-200",
      error ? "text-danger-600" : "text-gray-700",
      disabled && "text-gray-500"
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
              <span
                className={cn(
                  "text-lg transition-colors duration-200",
                  error ? "text-danger-500" : "text-gray-400",
                  disabled && "text-gray-400"
                )}
              >
                {leftIcon}
              </span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />

          {rightIcon && !rightAction && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none transition-colors duration-200">
              <span
                className={cn(
                  "text-lg",
                  error ? "text-danger-500" : "text-gray-400",
                  disabled && "text-gray-400"
                )}
              >
                {rightIcon}
              </span>
            </div>
          )}

          {rightIcon && rightAction && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {hint && !error && (
          <p className="text-sm text-gray-500 transition-colors duration-200">
            {hint}
          </p>
        )}

        {error && (
          <p className="text-sm text-danger-500 font-medium animate-pulse transition-colors duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
