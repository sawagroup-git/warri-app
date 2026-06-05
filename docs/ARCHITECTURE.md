# Wari App - Architecture Documentation

## Overview

Wari App is a full-stack mobile money transfer application with the following architecture:

### Frontend (React Native + Expo)

**Structure:**
- `src/components/` - Reusable UI components
- `src/screens/` - App screens/pages
- `src/services/` - Business logic and API calls
- `src/store/` - Redux state management
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `src/constants/` - App constants

### Backend (Node.js + Express)

**Structure:**
- `backend/routes/` - API route handlers
- `backend/controllers/` - Business logic
- `backend/models/` - Database models
- `backend/middleware/` - Express middleware
- `backend/migrations/` - Database migrations
- `backend/config/` - Configuration files

### Database (PostgreSQL)

**Tables:**
- `users` - User accounts and KYC information
- `transactions` - Money transfer transactions
- `notifications` - User notifications
- `audit_logs` - Transaction audit trails

### Key Technologies

- **Frontend:** React Native, Redux, Expo
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JWT
- **Security:** Helmet, Biometric Auth, AES-256 Encryption

## Data Flow

1. User authenticates via phone/password or biometric
2. Backend validates credentials and returns JWT tokens
3. Frontend stores tokens in secure storage
4. Subsequent requests include JWT in Authorization header
5. Backend validates token and processes request
6. Backend updates database and sends notifications
7. Frontend receives response and updates Redux store
8. UI re-renders with new data

## Security

- All passwords hashed with bcrypt
- JWT tokens with 1-hour expiration
- Refresh tokens for silent authentication
- Rate limiting on all endpoints
- Input validation with Zod schemas
- CORS configured for frontend domain
- Biometric authentication support
- Encrypted offline data storage
