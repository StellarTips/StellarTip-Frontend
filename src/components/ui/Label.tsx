"use client";

import { type LabelHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, isRequired, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-surface-700 dark:text-surface-300",
          className
        )}
        {...props}
      >
        {children}
        {isRequired && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label };
