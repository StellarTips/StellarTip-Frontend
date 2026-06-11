"use client";

import { cn } from "@/lib/utils/cn";
import { truncateAddress } from "@/lib/utils/format";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  address?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({ src, alt, fallback, size = "md", className, address }: AvatarProps) {
  const initial = fallback?.charAt(0).toUpperCase() || alt?.charAt(0).toUpperCase() || address?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700 font-medium",
        sizeStyles[size],
        className
      )}
      title={alt || fallback || address}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

export function AvatarWithInfo({
  src,
  alt,
  fallback,
  address,
  size = "md",
  className,
  subtitle,
}: AvatarProps & { subtitle?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar src={src} alt={alt} fallback={fallback} address={address} size={size} />
      <div className="min-w-0">
        {fallback && (
          <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-100">
            {fallback}
          </p>
        )}
        {subtitle && (
          <p className="truncate text-xs text-surface-500 dark:text-surface-400">
            {subtitle}
          </p>
        )}
        {address && !subtitle && (
          <p className="truncate text-xs text-surface-500 dark:text-surface-400">
            {truncateAddress(address)}
          </p>
        )}
      </div>
    </div>
  );
}
