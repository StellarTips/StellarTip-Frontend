#!/bin/bash

# Create labels
gh label create "setup" --color "1f77b4" --description "Setup and DevOps tasks" || true
gh label create "devops" --color "ff7f0e" --description "DevOps and infrastructure" || true
gh label create "docker" --color "2ca02c" --description "Docker related" || true
gh label create "ci" --color "d62728" --description "CI/CD" || true
gh label create "database" --color "9467bd" --description "Database tasks" || true
gh label create "backend" --color "8c564b" --description "Backend development" || true
gh label create "auth" --color "e377c2" --description "Authentication" || true
gh label create "users" --color "7f7f7f" --description "User management" || true
gh label create "frontend" --color "bcbd22" --description "Frontend development" || true
gh label create "wallet" --color "17becf" --description "Wallet integration" || true
gh label create "blockchain" --color "aec7e8" --description "Blockchain related" || true
gh label create "contracts" --color "ffbb78" --description "Smart contracts" || true
gh label create "soroban" --color "98df8a" --description "Soroban specific" || true
gh label create "api" --color "ff9896" --description "API development" || true
gh label create "ui" --color "c5b0d5" --description "UI/UX" || true
gh label create "flow" --color "c49c94" --description "Tipping flow" || true
gh label create "notifications" --color "f7b6d2" --description "Notifications" || true
gh label create "analytics" --color "dbdb8d" --description "Analytics" || true
gh label create "testing" --color "9edae5" --description "Testing" || true
gh label create "deployment" --color "ad494a" --description "Deployment" || true

# Issues
gh issue create --title "Initialize Turborepo monorepo structure" --body "Description: Set up the root directory with Turborepo, create all required folders (apps, packages, infra, docs), and configure basic package.json and turbo.json.

Acceptance Criteria:
- Root package.json with workspaces and turbo dependency
- turbo.json with basic task configuration
- All directories created as per structure
- .env.example file with placeholder variables

Labels: setup, devops
Priority: high
Estimated Effort: medium" --label "setup,devops"

gh issue create --title "Set up development environment with Docker" --body "Description: Create Docker Compose file for local development with PostgreSQL, and dockerfiles for each service.

Acceptance Criteria:
- docker-compose.yml in infra/docker
- Dockerfile for backend
- Dockerfile for frontend
- PostgreSQL service configured

Labels: setup, devops, docker
Priority: high
Estimated Effort: medium" --label "setup,devops,docker"

gh issue create --title "Configure CI/CD pipeline with GitHub Actions" --body "Description: Set up GitHub Actions workflow for build, test, and deploy.

Acceptance Criteria:
- .github/workflows/ci.yml
- Build and test steps for all apps
- Deploy to staging/production

Labels: devops, ci
Priority: medium
Estimated Effort: large" --label "devops,ci"

gh issue create --title "Set up PostgreSQL database with Neon" --body "Description: Configure Neon PostgreSQL instance and connection.

Acceptance Criteria:
- Neon project created
- DATABASE_URL configured
- Migration scripts set up

Labels: devops, database
Priority: high
Estimated Effort: small" --label "devops,database"

gh issue create --title "Implement user registration API" --body "Description: Create backend endpoint for user registration with username, email, wallet address.

Acceptance Criteria:
- POST /api/auth/register endpoint
- User model in database
- Input validation
- JWT token returned

Labels: backend, auth
Priority: high
Estimated Effort: medium" --label "backend,auth"

gh issue create --title "Implement user login API" --body "Description: Create backend endpoint for user login.

Acceptance Criteria:
- POST /api/auth/login endpoint
- Password verification
- JWT token returned

Labels: backend, auth
Priority: high
Estimated Effort: medium" --label "backend,auth"

gh issue create --title "Create user profile management API" --body "Description: Endpoints to get and update user profile.

Acceptance Criteria:
- GET /api/users/:id
- PUT /api/users/:id
- Profile fields: username, bio, wallet

Labels: backend, users
Priority: medium
Estimated Effort: medium" --label "backend,users"

gh issue create --title "Integrate Freighter wallet connection" --body "Description: Add Freighter wallet connection to frontend.

Acceptance Criteria:
- Connect button in UI
- Wallet address retrieval
- Connection status display

Labels: frontend, wallet
Priority: high
Estimated Effort: medium" --label "frontend,wallet"

gh issue create --title "Implement transaction signing" --body "Description: Sign Stellar transactions using Freighter.

Acceptance Criteria:
- Sign transaction function
- Handle signing errors
- Transaction submission

Labels: frontend, wallet, blockchain
Priority: high
Estimated Effort: medium" --label "frontend,wallet,blockchain"

gh issue create --title "Develop Soroban smart contract for tipping" --body "Description: Create Rust contract for tip storage and transfer.

Acceptance Criteria:
- Contract code in apps/contracts
- Tip function to send XLM/USDC
- Store tip records

Labels: contracts, soroban
Priority: high
Estimated Effort: large" --label "contracts,soroban"

gh issue create --title "Implement contract deployment script" --body "Description: Script to deploy contract to Stellar testnet/mainnet.

Acceptance Criteria:
- Deployment script in infra/scripts
- Environment configuration
- Contract address output

Labels: contracts, devops
Priority: medium
Estimated Effort: medium" --label "contracts,devops"

gh issue create --title "Create tip creation endpoint" --body "Description: API to create a tip transaction.

Acceptance Criteria:
- POST /api/tips
- Validate sender, receiver, amount
- Call smart contract
- Return transaction hash

Labels: backend, api
Priority: high
Estimated Effort: medium" --label "backend,api"

gh issue create --title "Create tip retrieval endpoints" --body "Description: Get tips for a user.

Acceptance Criteria:
- GET /api/tips?user=:id
- Paginated response
- Include transaction details

Labels: backend, api
Priority: medium
Estimated Effort: medium" --label "backend,api"

gh issue create --title "Set up database models" --body "Description: Create Prisma or TypeORM models for users, tips.

Acceptance Criteria:
- User model
- Tip model
- Database migrations

Labels: backend, database
Priority: high
Estimated Effort: medium" --label "backend,database"

gh issue create --title "Build creator profile page" --body "Description: Page to display creator info and tip link.

Acceptance Criteria:
- /creator/:username route
- Display bio, wallet
- Tip button

Labels: frontend, ui
Priority: high
Estimated Effort: medium" --label "frontend,ui"

gh issue create --title "Create dashboard for creators" --body "Description: Dashboard to view received tips.

Acceptance Criteria:
- /dashboard route
- List of tips
- Total amount

Labels: frontend, ui
Priority: high
Estimated Effort: medium" --label "frontend,ui"

gh issue create --title "Implement tip sending interface" --body "Description: Modal or page to send tip.

Acceptance Criteria:
- Amount input
- Confirm button
- Transaction status

Labels: frontend, ui
Priority: high
Estimated Effort: medium" --label "frontend,ui"

gh issue create --title "Implement full tipping flow" --body "Description: From tip button to confirmation.

Acceptance Criteria:
- Connect wallet if not
- Sign transaction
- Show success message
- Update dashboard

Labels: frontend, backend, flow
Priority: high
Estimated Effort: large" --label "frontend,backend,flow"

gh issue create --title "Set up email notifications" --body "Description: Send email when tip received.

Acceptance Criteria:
- Email service configured
- Template for tip notification
- Send on tip creation

Labels: backend, notifications
Priority: low
Estimated Effort: medium" --label "backend,notifications"

gh issue create --title "Create analytics dashboard" --body "Description: Charts for tip statistics.

Acceptance Criteria:
- Charts for daily/weekly tips
- Total earnings

Labels: frontend, analytics
Priority: low
Estimated Effort: large" --label "frontend,analytics"

gh issue create --title "Write unit tests for backend" --body "Description: Tests for API endpoints.

Acceptance Criteria:
- Jest setup
- Tests for auth endpoints
- 80% coverage

Labels: testing, backend
Priority: medium
Estimated Effort: medium" --label "testing,backend"

gh issue create --title "Write unit tests for smart contracts" --body "Description: Tests for Soroban contract.

Acceptance Criteria:
- Test framework set up
- Tests for tip function

Labels: testing, contracts
Priority: medium
Estimated Effort: medium" --label "testing,contracts"

gh issue create --title "Deploy frontend to Vercel" --body "Description: Set up Vercel deployment.

Acceptance Criteria:
- Vercel project connected
- Build configuration
- Domain set up

Labels: deployment, frontend
Priority: medium
Estimated Effort: small" --label "deployment,frontend"

gh issue create --title "Deploy backend to cloud" --body "Description: Deploy to Heroku or similar.

Acceptance Criteria:
- Cloud provider configured
- Environment variables set
- Database connected

Labels: deployment, backend
Priority: medium
Estimated Effort: medium" --label "deployment,backend"

gh issue create --title "Deploy smart contract to Stellar" --body "Description: Deploy to mainnet.

Acceptance Criteria:
- Contract deployed
- Address recorded

Labels: deployment, contracts
Priority: low
Estimated Effort: small" --label "deployment,contracts"