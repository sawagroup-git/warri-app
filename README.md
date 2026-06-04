# Wari App 💰

**Envoyer et recevoir de l'argent via Mobile Money**

Send and receive money via mobile money with sub-2% fees, biometric security, and full accessibility.

## 🎯 Overview

Wari App is a modern mobile money transfer platform designed for users in Côte d'Ivoire and West Africa. It enables seamless, secure, and affordable money transfers with a focus on accessibility and compliance.

### ✨ Key Features

- **Ultra-Low Fees** (<2%) with transparent fee breakdown
- **Multi-Provider Support** (Orange Money, MTN Money, Moov Money, Wave)
- **Biometric Authentication** (Fingerprint & Face recognition)
- **Real-Time Notifications** (Push, SMS, and in-app alerts)
- **Transaction Analytics Dashboard** with spending insights
- **Full Accessibility** (Screen readers, high contrast, voice commands)
- **Offline Data Encryption** with secure sync
- **Regional Compliance** (BCEAO, CIMA, KYC, AML/CFT)
- **Intuitive Minimalist UI** designed for all users

## 📱 Tech Stack

### Frontend
- **Framework**: React Native + Expo
- **State Management**: Redux Toolkit
- **UI Library**: React Native Paper (WCAG compliant)
- **Navigation**: React Navigation
- **Forms**: React Hook Form + Zod
- **Encryption**: libsodium.js + crypto-js

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL
- **Real-Time**: Redis + Socket.io
- **Notifications**: Firebase Cloud Messaging
- **Security**: JWT + Helmet.js

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI: `npm install -g expo-cli`
- PostgreSQL installed locally or access to PostgreSQL service
- Redis installed locally or access to Redis service

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/mrgohou/wari-app.git
cd wari-app
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Configure environment variables**
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. **Set up the database**
\`\`\`bash
npm run db:migrate
npm run db:seed
\`\`\`

5. **Start development server**

**Mobile (iOS/Android via Expo):**
\`\`\`bash
npm start
# Press 'a' for Android or 'i' for iOS
\`\`\`

**Web:**
\`\`\`bash
npm run web
\`\`\`

**Backend:**
\`\`\`bash
npm run backend:dev
\`\`\`

## 📁 Project Structure

\`\`\`
wari-app/
├── src/                          # Frontend (React Native)
│   ├── components/               # UI Components
│   │   ├── auth/                 # Authentication flows
│   │   ├── transfer/             # Money transfer UI
│   │   ├── dashboard/            # Analytics & history
│   │   └── accessibility/        # Accessibility components
│   ├── services/                 # Business logic
│   │   ├── auth/                 # Auth & encryption
│   │   ├── payment/              # Payment processing
│   │   ├── notification/         # Push & SMS alerts
│   │   └── offline/              # Offline support
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Redux state
│   ├── utils/                    # Utilities & helpers
│   ├── types/                    # TypeScript types
│   └── styles/                   # Theme & global styles
│
├── backend/                      # Backend (Node.js + Express)
│   ├── routes/                   # API routes
│   ├── controllers/              # Request handlers
│   ├── models/                   # Database models
│   ├── services/                 # Business services
│   ├── middleware/               # Express middleware
│   ├── migrations/               # Database migrations
│   ├── seeds/                    # Database seeds
│   └── config/                   # Configuration
│
├── tests/                        # Test files
├── docs/                         # Documentation
├── package.json
├── tsconfig.json
└── .env.example
\`\`\`

## 🔐 Security Features

### Authentication
- ✅ Biometric authentication (fingerprint, face recognition)
- ✅ PIN-based backup authentication
- ✅ JWT tokens with refresh rotation
- ✅ Session timeout management

### Encryption
- ✅ AES-256 encryption for offline data
- ✅ TLS 1.3 for data in transit
- ✅ PBKDF2 key derivation
- ✅ Secure key storage on device

### Compliance
- ✅ KYC (Know Your Customer) requirements
- ✅ AML/CFT (Anti-Money Laundering/Counter Financing of Terrorism)
- ✅ Transaction audit logs
- ✅ Data residency (local storage)

## ♿ Accessibility Features

### Screen Reader Support
- ✅ Semantic HTML structure
- ✅ ARIA labels and descriptions
- ✅ Accessible form labels
- ✅ Focus management

### Visual Accessibility
- ✅ High-contrast theme option
- ✅ Minimum 4.5:1 contrast ratio (WCAG AA)
- ✅ Text scaling support
- ✅ Dark mode support

### Motor/Input Accessibility
- ✅ Full keyboard navigation
- ✅ Voice command support
- ✅ Customizable touch targets (min 48px)
- ✅ Haptic feedback options

### Cognitive Accessibility
- ✅ Clear, simple language
- ✅ Intuitive navigation
- ✅ Consistent layout
- ✅ Error prevention & recovery

## 💳 Supported Providers (Côte d'Ivoire)

| Provider | Fee | Transfer Limit | Supported |
|----------|-----|-----------------|-----------|
| Orange Money | 1.5% | 5,000,000 XOF | ✅ |
| MTN Money | 1.8% | 5,000,000 XOF | ✅ |
| Moov Money | 1.7% | 5,000,000 XOF | ✅ |
| Wave | 1.2% | 5,000,000 XOF | ✅ |

## 📊 Analytics Dashboard

View your transaction insights:
- **Spending by Category** - Pie chart breakdown
- **Monthly Trends** - Line chart of transfer amounts
- **Top Recipients** - Most frequent transfers
- **Transaction History** - Searchable, filterable list
- **Export Reports** - CSV/PDF downloads

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage
\`\`\`

## 📝 API Documentation

See docs/API.md for detailed API documentation.

## 🔍 Code Quality

\`\`\`bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Security audit
npm run security:audit

# Accessibility check
npm run accessibility:check
\`\`\`

## 🤝 Contributing

1. Create a feature branch (git checkout -b feature/amazing-feature)
2. Commit your changes (git commit -m 'Add amazing feature')
3. Push to the branch (git push origin feature/amazing-feature)
4. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## ⚠️ Security Notice

If you discover a security vulnerability, please report it responsibly.

## 📞 Support

- Email: support@wari-app.local
- Issues: GitHub Issues

---

**Made with 💰 for seamless money transfers**
