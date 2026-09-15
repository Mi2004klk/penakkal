"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  description?: string;
}

export default function FormField({ label, error, children, description }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block font-ui text-body-sm font-bold text-heading mb-1.5">
        {label}
      </label>
      {description && (
        <p className="text-muted-text text-xs font-ui mb-2">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-semantic-error text-xs font-ui font-medium mt-1.5">{error}</p>
      )}
    </div>
  );
}
