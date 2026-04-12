# GitHub Issues for StellarTip

## Setup & DevOps

### 1. Initialize Turborepo monorepo structure

**Description:** Set up the root directory with Turborepo, create all required folders (apps, packages, infra, docs), and configure basic package.json and turbo.json.

**Acceptance Criteria:**

- Root package.json with workspaces and turbo dependency

- turbo.json with basic task configuration

- All directories created as per structure

- .env.example file with placeholder variables

**Labels:** setup, devops

**Priority:** high

**Estimated Effort:** medium

### 2. Set up development environment with Docker

**Description:** Create Docker Compose file for local development with PostgreSQL, and dockerfiles for each service.

**Acceptance Criteria:**

- docker-compose.yml in infra/docker

- Dockerfile for backend

- Dockerfile for frontend

- PostgreSQL service configured

**Labels:** setup, devops, docker

**Priority:** high

**Estimated Effort:** medium

### 3. Configure CI/CD pipeline with GitHub Actions

**Description:** Set up GitHub Actions workflow for build, test, and deploy.

**Acceptance Criteria:**

- .github/workflows/ci.yml

- Build and test steps for all apps

- Deploy to staging/production

**Labels:** devops, ci

**Priority:** medium

**Estimated Effort:** large

### 4. Set up PostgreSQL database with Neon

**Description:** Configure Neon PostgreSQL instance and connection.

**Acceptance Criteria:**

- Neon project created

- DATABASE_URL configured

- Migration scripts set up

**Labels:** devops, database

**Priority:** high

**Estimated Effort:** small

## Authentication & Users

### 5. Implement user registration API

**Description:** Create backend endpoint for user registration with username, email, wallet address.

**Acceptance Criteria:**

- POST /api/auth/register endpoint

- User model in database

- Input validation

- JWT token returned

**Labels:** backend, auth

**Priority:** high

**Estimated Effort:** medium

### 6. Implement user login API

**Description:** Create backend endpoint for user login.

**Acceptance Criteria:**

- POST /api/auth/login endpoint

- Password verification

- JWT token returned

**Labels:** backend, auth

**Priority:** high

**Estimated Effort:** medium

### 7. Create user profile management API

**Description:** Endpoints to get and update user profile.

**Acceptance Criteria:**

- GET /api/users/:id

- PUT /api/users/:id

- Profile fields: username, bio, wallet

**Labels:** backend, users

**Priority:** medium

**Estimated Effort:** medium

## Wallet Integration

### 8. Integrate Freighter wallet connection

**Description:** Add Freighter wallet connection to frontend.

**Acceptance Criteria:**

- Connect button in UI

- Wallet address retrieval

- Connection status display

**Labels:** frontend, wallet

**Priority:** high

**Estimated Effort:** medium

### 9. Implement transaction signing

**Description:** Sign Stellar transactions using Freighter.

**Acceptance Criteria:**

- Sign transaction function

- Handle signing errors

- Transaction submission

**Labels:** frontend, wallet, blockchain

**Priority:** high

**Estimated Effort:** medium

## Smart Contracts (Tip logic)

### 10. Develop Soroban smart contract for tipping

**Description:** Create Rust contract for tip storage and transfer.

**Acceptance Criteria:**

- Contract code in apps/contracts

- Tip function to send XLM/USDC

- Store tip records

**Labels:** contracts, soroban

**Priority:** high

**Estimated Effort:** large

### 11. Implement contract deployment script

**Description:** Script to deploy contract to Stellar testnet/mainnet.

**Acceptance Criteria:**

- Deployment script in infra/scripts

- Environment configuration

- Contract address output

**Labels:** contracts, devops

**Priority:** medium

**Estimated Effort:** medium

## Backend API

### 12. Create tip creation endpoint

**Description:** API to create a tip transaction.

**Acceptance Criteria:**

- POST /api/tips

- Validate sender, receiver, amount

- Call smart contract

- Return transaction hash

**Labels:** backend, api

**Priority:** high

**Estimated Effort:** medium

### 13. Create tip retrieval endpoints

**Description:** Get tips for a user.

**Acceptance Criteria:**

- GET /api/tips?user=:id

- Paginated response

- Include transaction details

**Labels:** backend, api

**Priority:** medium

**Estimated Effort:** medium

### 14. Set up database models

**Description:** Create Prisma or TypeORM models for users, tips.

**Acceptance Criteria:**

- User model

- Tip model

- Database migrations

**Labels:** backend, database

**Priority:** high

**Estimated Effort:** medium

## Frontend UI/UX

### 15. Build creator profile page

**Description:** Page to display creator info and tip link.

**Acceptance Criteria:**

- /creator/:username route

- Display bio, wallet

- Tip button

**Labels:** frontend, ui

**Priority:** high

**Estimated Effort:** medium

### 16. Create dashboard for creators

**Description:** Dashboard to view received tips.

**Acceptance Criteria:**

- /dashboard route

- List of tips

- Total amount

**Labels:** frontend, ui

**Priority:** high

**Estimated Effort:** medium

### 17. Implement tip sending interface

**Description:** Modal or page to send tip.

**Acceptance Criteria:**

- Amount input

- Confirm button

- Transaction status

**Labels:** frontend, ui

**Priority:** high

**Estimated Effort:** medium

## Tipping Flow

### 18. Implement full tipping flow

**Description:** From tip button to confirmation.

**Acceptance Criteria:**

- Connect wallet if not

- Sign transaction

- Show success message

- Update dashboard

**Labels:** frontend, backend, flow

**Priority:** high

**Estimated Effort:** large

## Notifications

### 19. Set up email notifications

**Description:** Send email when tip received.

**Acceptance Criteria:**

- Email service configured

- Template for tip notification

- Send on tip creation

**Labels:** backend, notifications

**Priority:** low

**Estimated Effort:** medium

## Analytics

### 20. Create analytics dashboard

**Description:** Charts for tip statistics.

**Acceptance Criteria:**

- Charts for daily/weekly tips

- Total earnings

**Labels:** frontend, analytics

**Priority:** low

**Estimated Effort:** large

## Testing

### 21. Write unit tests for backend

**Description:** Tests for API endpoints.

**Acceptance Criteria:**

- Jest setup

- Tests for auth endpoints

- 80% coverage

**Labels:** testing, backend

**Priority:** medium

**Estimated Effort:** medium

### 22. Write unit tests for smart contracts

**Description:** Tests for Soroban contract.

**Acceptance Criteria:**

- Test framework set up

- Tests for tip function

**Labels:** testing, contracts

**Priority:** medium

**Estimated Effort:** medium

## Deployment

### 23. Deploy frontend to Vercel

**Description:** Set up Vercel deployment.

**Acceptance Criteria:**

- Vercel project connected

- Build configuration

- Domain set up

**Labels:** deployment, frontend

**Priority:** medium

**Estimated Effort:** small

### 24. Deploy backend to cloud

**Description:** Deploy to Heroku or similar.

**Acceptance Criteria:**

- Cloud provider configured

- Environment variables set

- Database connected

**Labels:** deployment, backend

**Priority:** medium

**Estimated Effort:** medium

### 25. Deploy smart contract to Stellar

**Description:** Deploy to mainnet.

**Acceptance Criteria:**

- Contract deployed

- Address recorded

**Labels:** deployment, contracts

**Priority:** low

**Estimated Effort:** small