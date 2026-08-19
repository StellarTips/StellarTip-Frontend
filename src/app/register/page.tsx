import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = createMetadata({ title: "Register" });

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Start receiving tips on the Stellar network
          </p>
        </div>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-surface-500 dark:text-surface-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
