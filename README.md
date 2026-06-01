# StellarTip Frontend

A decentralized micro-tipping platform for creators on the Stellar ecosystem.

Built with [Next.js](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).

## Overview

StellarTip allows creators to receive instant micro-payments (tips) from supporters globally using the Stellar blockchain. This repository contains the frontend application — a Next.js app with Freighter wallet integration for connecting to the Stellar network.

## Tech Stack

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| Next.js 15     | React framework (App Router)   |
| TypeScript     | Type safety                    |
| Tailwind CSS 4 | Utility-first styling          |
| Stellar SDK    | Blockchain interaction         |
| Freighter      | Wallet connection              |

## Project Structure

```
.
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── layout.tsx # Root layout with metadata
│   │   └── page.tsx   # Landing page
│   ├── components/
│   │   └── ui/        # Reusable UI components (Button, Card, etc.)
│   ├── config/        # Application configuration
│   ├── hooks/         # Custom React hooks (useWallet)
│   ├── lib/           # Utilities & SDK wrappers
│   │   ├── api.ts     # API client
│   │   └── sdk/       # Stellar/Freighter integration
│   ├── styles/        # Global styles & Tailwind setup
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── docs/              # Documentation
├── .env.example       # Environment variable template
├── next.config.ts     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies & scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- [Freighter wallet](https://freighter.app/) browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/StellarTips/StellarTip-Frontend.git
cd StellarTip-Frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start development server     |
| `npm run build`        | Production build             |
| `npm run start`        | Start production server      |
| `npm run lint`         | Run ESLint                   |
| `npm run typecheck`    | Run TypeScript type checking |
| `npm run format`       | Format code with Prettier    |
| `npm run format:check` | Check code formatting        |

## Features

- **Creator Profiles** — Custom profiles with tip links
- **Freighter Wallet** — Seamless Stellar wallet integration
- **Instant Tipping** — Send XLM/USDC tips with near-zero fees
- **Creator Dashboard** — Track earnings and tip history
- **QR Code Tipping** — Share your tip link via QR code

## Learn More

- [API Specification](./docs/api-spec.md)
- [Architecture Overview](./docs/architecture.md)

## License

MIT
