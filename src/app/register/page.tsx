import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
        <form className="space-y-4" action="#">
          <Input label="Username" placeholder="creatorname" required />
          <Input type="email" label="Email" placeholder="you@example.com" required />
          <Input type="password" label="Password" placeholder="Create a password" required />
          <Input label="Wallet Address" placeholder="G..." helperText="Your Stellar wallet address" />
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
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
