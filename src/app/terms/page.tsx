import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({ title: "Terms of Service", noIndex: true });

export default function TermsPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
          Terms of Service
        </h1>
        <p className="mt-4 text-surface-500 dark:text-surface-400">
          By using StellarTip, you agree to the following terms and conditions.
        </p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Acceptance of Terms</h2>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              By accessing or using StellarTip, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Blockchain Transactions</h2>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              All transactions are final and irreversible once confirmed on the Stellar blockchain. StellarTip is not responsible for lost funds or incorrect addresses.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">User Conduct</h2>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              Users agree not to use the platform for illegal activities, fraud, or harassment. Violation may result in account suspension.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
