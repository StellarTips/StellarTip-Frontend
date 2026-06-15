import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({ title: "Privacy Policy", noIndex: true });

export default function PrivacyPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
          Privacy Policy
        </h1>
        <p className="mt-4 text-surface-500 dark:text-surface-400">
          StellarTip respects your privacy. This policy outlines how we collect, use, and protect
          your data.
        </p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Data Collection
            </h2>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              We collect minimal information: your username, email, and Stellar wallet address. We
              do not store private keys or financial data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Blockchain Transparency
            </h2>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              All transactions are recorded on the Stellar blockchain and are publicly visible. This
              is inherent to the technology.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Cookies
            </h2>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              We use essential cookies only for session management and theme preferences. No
              tracking cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
