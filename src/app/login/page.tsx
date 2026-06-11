import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata: Metadata = createMetadata({ title: "Login" });

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Sign in to your StellarTip account
          </p>
        </div>
        <form className="space-y-4" action="#">
          <Input type="email" label="Email" placeholder="you@example.com" required />
          <Input type="password" label="Password" placeholder="Enter your password" required />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-surface-500 dark:text-surface-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary-600 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
