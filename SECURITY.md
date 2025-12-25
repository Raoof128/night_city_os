# Security Policy

## Supported Versions

Currently, only the latest version of Night City OS is supported for security updates.

| Version | Supported          |
| ------- | ------------------ |
| 3.1.x   | :white_check_mark: |
| < 3.1   | :x:                |

## Reporting a Vulnerability

We take the security of our project seriously. If you believe you've found a security vulnerability, please report it to us by following these steps:

1. **Do not open a public issue.** This could expose users to risk.
2. Send an email to the project maintainer at `security@nightcity.os` (placeholder) or open a private security advisory on GitHub.
3. We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Environment Security

Night City OS runs entirely in the browser. However, please be aware:
- **API Keys**: User-provided Gemini API keys are handled via Vite environment variables and should never be committed to source control.
- **LocalStorage**: System state is persisted in `localStorage`. Avoid storing sensitive personal information.
