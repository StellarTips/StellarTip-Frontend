# StellarTip

A full-stack decentralized micro-tipping platform for creators on the Stellar ecosystem.

## Overview

StellarTip allows creators to receive instant micro-payments (tips) from supporters globally using the Stellar blockchain. Built with Next.js, NestJS, Soroban smart contracts, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js (TypeScript, App Router)
- **Backend**: NestJS (TypeScript)
- **Smart Contracts**: Rust (Soroban)
- **Database**: PostgreSQL (Neon)
- **Architecture**: Monorepo (Turborepo)
- **Blockchain**: Stellar
- **Wallet**: Freighter

## Features

### Core MVP
- Creator profiles with username, bio, wallet address
- Unique tip links per creator
- Freighter wallet integration
- Instant XLM/USDC tip payments
- Creator dashboard with tip history

### Advanced
- Custom tip amounts
- QR code tipping
- Social sharing
- Supporter lists
- Subscription payments
- NFT rewards
- Embeddable widgets
- Analytics dashboard

## Project Structure

```
root/
├── apps/
│   ├── frontend/              # Creator pages + dashboard
│   ├── backend/               # API (users, tips, profiles)
│   └── contracts/             # Soroban smart contracts (tips)
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── config/                # Configuration utilities
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   └── sdk/                   # Blockchain interaction logic
├── infra/
│   ├── docker/                # Docker configurations
│   ├── ci/                    # CI/CD configurations
│   └── scripts/               # Deployment and utility scripts
├── docs/
│   ├── architecture.md        # System architecture
│   ├── api-spec.md            # API specifications
│   ├── tipping-flow.md        # Tipping flow documentation
│   └── product-requirements.md # Product requirements
├── .env.example               # Environment variables template
├── turbo.json                 # Turborepo configuration
├── package.json               # Root package configuration
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for local development)
- Rust (for smart contracts)
- Soroban CLI

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in values
4. Start development: `npm run dev`

### Development

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all services
- `npm run test` - Run tests
- `npm run lint` - Lint code

## Contributing

See [issues.md](issues.md) for current tasks and priorities.

## License

MIT