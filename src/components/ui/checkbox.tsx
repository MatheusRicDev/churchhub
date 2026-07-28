"use client"

import { forwardRef } from "react"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className={`h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-900 dark:checked:bg-white dark:checked:border-white ${className}`}
          {...props}
        />
        {label && (
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"
