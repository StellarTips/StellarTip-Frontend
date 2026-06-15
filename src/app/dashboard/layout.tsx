import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "Dashboard" });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64">
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/tips"
              className="rounded-lg px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              Tips
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded-lg px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
