import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Zap, Globe, Shield, Wallet } from "lucide-react";

export const metadata: Metadata = createMetadata({ title: "About" });

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
          About StellarTip
        </h1>
        <p className="mt-4 text-lg text-surface-500 dark:text-surface-400">
          Empowering creators to receive instant, global micro-payments on the Stellar blockchain.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <Card>
          <Wallet className="h-8 w-8 text-primary-600" />
          <h3 className="mt-4 text-lg font-semibold">Wallet-First</h3>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Connect your Freighter wallet for seamless, secure transactions. No custodial accounts
            needed.
          </p>
        </Card>
        <Card>
          <Zap className="h-8 w-8 text-primary-600" />
          <h3 className="mt-4 text-lg font-semibold">Near-Instant</h3>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Transactions settle in ~5 seconds. No waiting days for funds to clear.
          </p>
        </Card>
        <Card>
          <Globe className="h-8 w-8 text-primary-600" />
          <h3 className="mt-4 text-lg font-semibold">Global Reach</h3>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Receive tips from anywhere in the world without cross-border fees or banking delays.
          </p>
        </Card>
        <Card>
          <Shield className="h-8 w-8 text-primary-600" />
          <h3 className="mt-4 text-lg font-semibold">Zero Platform Fees</h3>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            We don&apos;t take a cut. Only the minimal Stellar network fee applies to each
            transaction.
          </p>
        </Card>
      </div>
    </div>
  );
}
