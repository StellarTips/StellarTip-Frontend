import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-surface-200 dark:border-surface-800">
        <div className="container-page flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary-600"
          >
            StellarTip
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container-page flex flex-col items-center py-24 text-center sm:py-32">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300">
            Built on Stellar ✦
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Instant micro-tipping for
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {" "}creators everywhere
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-surface-500 dark:text-surface-400">
            Receive instant micro-payments from supporters globally using the
            Stellar blockchain. No middlemen. No delays. Just pure creator
            support.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
            >
              Start receiving tips
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center rounded-lg border-2 border-surface-300 px-6 py-3 text-base font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800"
            >
              Learn more
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-surface-200 py-24 dark:border-surface-800">
          <div className="container-page">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Everything you need to receive support
            </h2>
            <p className="mt-4 text-center text-surface-500 dark:text-surface-400">
              A complete toolkit for creators to monetize their work.
            </p>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-surface-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary-600 py-16 text-white">
          <div className="container-page grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-4xl font-bold">0.01¢</p>
              <p className="mt-1 text-sm text-primary-100">
                Average transaction fee
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold">5s</p>
              <p className="mt-1 text-sm text-primary-100">
                Settlement time
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold">Global</p>
              <p className="mt-1 text-sm text-primary-100">
                Reach supporters worldwide
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-8 dark:border-surface-800">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-sm text-surface-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} StellarTip. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-surface-700 dark:hover:text-surface-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-surface-700 dark:hover:text-surface-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Wallet Integration",
    description:
      "Seamlessly connect with Freighter wallet for secure, instant transactions on the Stellar network.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
  },
  {
    title: "Instant Payments",
    description:
      "Receive tips in XLM or USDC with near-instant settlement and minimal fees on the Stellar network.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Creator Dashboard",
    description:
      "Track your earnings, view tip history, and gain insights into your supporters and their generosity.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Unique Tip Links",
    description:
      "Share your personalized tip link anywhere — social media, bio, or your website — and start receiving support.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.36a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 002.475 7.652" />
      </svg>
    ),
  },
  {
    title: "Blockchain Powered",
    description:
      "Built on Stellar for fast, low-cost transactions. Your earnings are secure, transparent, and decentralized.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: "Zero Platform Fees",
    description:
      "We don't take a cut. Only the minimal Stellar network fee is deducted from each transaction.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];
