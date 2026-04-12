# Architecture

## System Overview

StellarTip is a monorepo-based application consisting of three main applications and shared packages.

## Applications

### Frontend (Next.js)
- **Purpose**: User interface for creators and tippers
- **Tech**: Next.js 14, TypeScript, Tailwind CSS
- **Features**: Creator profiles, tipping interface, dashboard

### Backend (NestJS)
- **Purpose**: API server for user management, tips, and blockchain interactions
- **Tech**: NestJS, TypeScript, PostgreSQL
- **Features**: Authentication, user profiles, tip processing

### Contracts (Soroban)
- **Purpose**: Smart contracts for tip transactions
- **Tech**: Rust, Soroban SDK
- **Features**: Tip storage, payment processing

## Packages

### UI
- Shared React components and design system

### Config
- Configuration utilities and constants

### Types
- Shared TypeScript type definitions

### Utils
- Utility functions and helpers

### SDK
- Blockchain interaction library (Stellar SDK, Soroban client)

## Infrastructure

### Database
- PostgreSQL hosted on Neon
- Prisma ORM for type-safe database access

### Deployment
- Frontend: Vercel
- Backend: Cloud provider (Heroku/AWS)
- Contracts: Stellar network

### CI/CD
- GitHub Actions for automated testing and deployment

## Data Flow

1. User connects Freighter wallet
2. Frontend requests tip creation
3. Backend validates and calls smart contract
4. Contract processes payment on Stellar
5. Backend stores transaction data
6. Frontend updates UI with confirmation