"use client";

import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "circle" | "rect" | "text";
  width?: string;
  height?: string;
}

export function Skeleton({ className, variant = "rect", width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-200 dark:bg-surface-700",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-lg",
        variant === "text" && "rounded-md",
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height="16px" />
          <Skeleton variant="text" width="40%" height="12px" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" width="100%" height="12px" />
        <Skeleton variant="text" width="80%" height="12px" />
      </div>
    </div>
  );
}
