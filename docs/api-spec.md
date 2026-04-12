# API Specification

## Base URL
`https://api.stellartip.com`

## Authentication
JWT Bearer token required for protected endpoints.

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "walletAddress": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "walletAddress": "string"
  }
}
```

#### POST /auth/login
Login user.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Users

#### GET /users/:id
Get user profile.

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "bio": "string",
  "walletAddress": "string"
}
```

#### PUT /users/:id
Update user profile.

### Tips

#### POST /tips
Create a tip.

**Request:**
```json
{
  "receiverId": "string",
  "amount": "string",
  "currency": "XLM" | "USDC"
}
```

**Response:**
```json
{
  "id": "string",
  "transactionHash": "string",
  "status": "pending" | "confirmed"
}
```

#### GET /tips?user=:id
Get tips for user.

**Response:**
```json
{
  "tips": [
    {
      "id": "string",
      "amount": "string",
      "sender": "string",
      "timestamp": "string",
      "transactionHash": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```