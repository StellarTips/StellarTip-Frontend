"use client";

import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300",
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  outline: "border border-surface-300 text-surface-700 dark:border-surface-600 dark:text-surface-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
