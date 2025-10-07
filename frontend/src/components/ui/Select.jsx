import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Select = forwardRef(
  (
    {
      label,
      error,
      hint,
      options = [],
      placeholder = "Seleccionar...",
      fullWidth = false,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const selectClasses = cn(
      "w-full px-3 py-2 border rounded-lg transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
      "disabled:bg-gray-100 disabled:cursor-not-allowed",
      error
        ? "border-danger-500 focus:ring-danger-500"
        : "border-gray-300 focus:ring-primary-500"
    );

    const containerClasses = cn(fullWidth ? "w-full" : "", className);

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <select ref={ref} id={selectId} className={selectClasses} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}

        {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
