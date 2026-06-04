# Contributing to Wari App

Thank you for your interest in contributing to Wari App! We welcome contributions from everyone. This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and inclusive. We are committed to providing a welcoming and inspiring community for all.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/wari-app.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the development setup in [README.md](../README.md)

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code structure and naming conventions
- Use ESLint and Prettier: `npm run lint:fix`
- Keep components small and focused
- Write meaningful commit messages

### Accessibility

All UI components must be accessible:
- Add proper ARIA labels and roles
- Ensure keyboard navigation works
- Test with screen readers
- Maintain minimum 4.5:1 contrast ratio
- Use semantic HTML structure

### Testing

- Write unit tests for services and utilities
- Write component tests for UI components
- Aim for >80% code coverage
- Run tests: `npm test`
- Check coverage: `npm run test:coverage`

### Commits

Use conventional commit format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(auth): add biometric authentication support

Implement fingerprint and face recognition using expo-local-authentication.
Add secure token storage with expo-secure-store.

Closes #42
```

## Pull Request Process

1. Update README.md with any new features or changes
2. Ensure all tests pass: `npm test`
3. Run linter: `npm run lint`
4. Check types: `npm run type-check`
5. Create PR with clear description
6. Link related issues
7. Wait for review and CI to pass

## Security

- Never commit secrets or API keys
- Use `.env.example` for configuration templates
- Follow security best practices
- Report vulnerabilities privately (see SECURITY.md)

## Documentation

- Keep documentation up-to-date
- Document new features and APIs
- Add JSDoc comments to functions
- Update CHANGELOG for significant changes

## Questions?

- Check existing issues and discussions
- Ask in GitHub Discussions
- Read documentation in `/docs`

Thank you for contributing! 🙌
