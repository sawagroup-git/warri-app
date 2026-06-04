# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Wari App, please report it responsibly by emailing security@wari-app.local instead of using the issue tracker.

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information

## Security Best Practices

### Authentication & Authorization
- ✅ Use strong PINs (4+ digits minimum)
- ✅ Enable biometric authentication
- ✅ Sessions timeout after 15 minutes of inactivity
- ✅ JWT tokens expire after 1 hour
- ✅ Refresh tokens stored securely on device

### Data Protection
- ✅ All sensitive data encrypted at rest (AES-256)
- ✅ All data in transit uses TLS 1.3
- ✅ Local database encrypted with device keystore
- ✅ PINs never transmitted in plaintext
- ✅ Tokens stored in secure storage

### Compliance
- ✅ KYC (Know Your Customer) verification required
- ✅ AML/CFT (Anti-Money Laundering) checks
- ✅ Transaction audit logs retained for 7 years
- ✅ GDPR compliant data handling
- ✅ PCI DSS standards followed

### Development Security
- ✅ Dependencies regularly audited: `npm audit`
- ✅ Security headers enabled (Helmet.js)
- ✅ CORS properly configured
- ✅ Input validation on all endpoints
- ✅ Rate limiting to prevent abuse
- ✅ SQL injection prevention with parameterized queries
- ✅ XSS protection enabled
- ✅ CSRF tokens for state-changing operations

### Secrets Management
- ❌ Never commit `.env` files
- ✅ Use `.env.example` for templates
- ✅ Rotate secrets regularly
- ✅ Use strong, random values
- ✅ Restrict secret access

### Deployment Security
- ✅ HTTPS/TLS enforced
- ✅ Security headers configured
- ✅ Regular security updates applied
- ✅ Database backups encrypted
- ✅ Access logs monitored
- ✅ Intrusion detection enabled

## Vulnerability Disclosure

We follow a 90-day vulnerability disclosure timeline:
1. Initial report received
2. Acknowledgment within 48 hours
3. Assessment and fix development
4. Fix tested and deployed
5. Public disclosure and CVE if applicable

## Security Updates

- Subscribe to security advisories
- Update dependencies promptly
- Apply patches within 24-48 hours for critical issues
- Test updates in staging before production

## Contact

- **Security**: security@wari-app.local
- **Support**: support@wari-app.local
- **Issues**: GitHub Issues (non-sensitive only)
