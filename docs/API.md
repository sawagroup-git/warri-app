# Wari App - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login user with phone and password.

**Request:**
```json
{
  "phone": "+22501234567",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone": "+22501234567",
    "firstName": "John",
    "lastName": "Doe",
    "kycStatus": "verified",
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### POST /auth/register
Register new user.

**Request:**
```json
{
  "phone": "+22501234567",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Transactions

#### GET /transactions
Get user's transaction history.

**Query Parameters:**
- `status`: Filter by transaction status
- `provider`: Filter by mobile money provider
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

#### POST /transactions/send
Send money to recipient.

**Request:**
```json
{
  "recipientPhone": "+22501234567",
  "amount": 10000,
  "provider": "orange_money",
  "description": "Payment for goods"
}
```

#### GET /transactions/:id
Get transaction details.

#### GET /transactions/analytics/dashboard
Get transaction analytics and statistics.

## Error Responses

```json
{
  "success": false,
  "error": "Error message"
}
```

## Status Codes

- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error
