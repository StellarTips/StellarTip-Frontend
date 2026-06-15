import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold tracking-tight text-primary-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-surface-900 dark:text-surface-100">
        Page not found
      </h2>
      <p className="mt-2 max-w-md text-surface-500 dark:text-surface-400">
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
}
