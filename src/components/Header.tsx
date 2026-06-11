"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-800 dark:bg-surface-950/80">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary-600"
        >
          StellarTip
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/about" className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100">
            About
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100">
            Dashboard
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <ConnectWalletButton />
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-surface-200 bg-white px-4 py-4 dark:border-surface-800 dark:bg-surface-950 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/about" className="text-sm font-medium text-surface-600 dark:text-surface-400" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-surface-600 dark:text-surface-400" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          </nav>
          <div className="mt-4 flex items-center gap-3 border-t border-surface-200 pt-4 dark:border-surface-800">
            <ThemeToggle />
            <ConnectWalletButton />
          </div>
        </div>
      )}
    </header>
  );
}
