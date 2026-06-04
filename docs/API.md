# API Documentation

Wari App Backend API documentation.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN
```

## Endpoints

### Authentication

#### Register

```http
POST /auth/register
```

**Request Body:**
```json
{
  "phone": "0712345678",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "pin": "1234"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "phone": "0712345678",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "kycStatus": "pending",
      "accountStatus": "active"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "phone": "0712345678",
  "pin": "1234"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}
```

### Transactions

#### Create Transaction

```http
POST /transactions/create
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "recipientPhone": "0712345678",
  "amount": 50000,
  "provider": "wave",
  "notes": "Payment for goods"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "txn-123",
    "senderId": "user-123",
    "recipientPhone": "0712345678",
    "amount": 50000,
    "provider": "wave",
    "fee": 600,
    "totalAmount": 50600,
    "status": "pending",
    "reference": "WAR1234567890",
    "createdAt": "2026-06-04T19:30:00Z"
  }
}
```

#### Get Transaction History

```http
GET /transactions/history?page=1&limit=20
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [ ... ],
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

#### Get Transaction Details

```http
GET /transactions/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Header**: `X-RateLimit-Remaining`

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Server Error
