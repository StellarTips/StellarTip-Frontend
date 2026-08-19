# API Specification

## Base URL
`https://api.stellartip.com`

## Authentication
JWT Bearer token required for protected endpoints.

## Response Envelope

All successful responses are wrapped in:
```json
{
  "success": true,
  "statusCode": 200,
  "data": "<payload>",
  "requestId": "string",
  "timestamp": "ISO 8601"
}
```

All error responses use:
```json
{
  "statusCode": 400,
  "message": "string",
  "errors": { "field": ["error message"] },
  "requestId": "string",
  "timestamp": "ISO 8601",
  "path": "string"
}
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "username": "string",
  "displayName": "string (optional)"
}
```

**Response (data):**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "expires_in": 3600,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "displayName": "string",
    "bio": "string",
    "walletAddress": "string",
    "avatarUrl": "string",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
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

**Response (data):**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "expires_in": 3600,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "displayName": "string",
    "bio": "string",
    "walletAddress": "string",
    "avatarUrl": "string",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

### Profiles

#### GET /profiles/:username
Get a public creator profile by username.

**Response (data):**
```json
{
  "id": "string",
  "username": "string",
  "displayName": "string",
  "bio": "string",
  "walletAddress": "string",
  "avatarUrl": "string",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

#### GET /profiles/:username/tipping-info
Get tipping wallet information for a creator.

**Response (data):**
```json
{
  "walletAddress": "string",
  "username": "string",
  "displayName": "string",
  "avatarUrl": "string"
}
```

### Tips

#### POST /tips
Create a tip (JWT-guarded).

**Request:**
```json
{
  "receiverWallet": "string",
  "senderWallet": "string (optional)",
  "amount": 10.0,
  "asset": "XLM | USDC (optional, defaults to XLM)",
  "message": "string (optional, max 280 chars)"
}
```

**Response (data):**
```json
{
  "id": "string",
  "transactionHash": "string",
  "status": "pending | confirmed | failed"
}
```

#### GET /tips/my/received
Get tips received by the authenticated user (JWT-guarded).

**Query params:** `page` (default 1), `limit` (default 20)

**Response (data):**
```json
{
  "data": [
    {
      "id": "string",
      "senderWallet": "string",
      "receiverId": "string",
      "receiverWallet": "string",
      "amount": 10.0,
      "asset": "XLM",
      "message": "string",
      "status": "confirmed",
      "transactionHash": "string",
      "createdAt": "ISO 8601"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```
