import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-white dark:bg-surface-800",
  bordered:
    "bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700",
  elevated:
    "bg-white dark:bg-surface-800 shadow-md shadow-surface-200/50 dark:shadow-surface-900/50",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "bordered", padding = "md", className = "", children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card, type CardProps };
