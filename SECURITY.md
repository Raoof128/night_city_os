# Security Policy

## Supported Versions

| Version  | Supported          |
| -------- | ------------------ |
| 5.6.x    | ✅                 |
| 5.1.x    | ✅                 |
| 5.0.x    | ⚠️ Legacy support   |
| < 5.0    | ❌ End of Life      |

## Reporting a Vulnerability
1. **Do not open a public issue.** This protects users while we patch.
2. Email the maintainer at `security@nightcity.os` (placeholder) or open a private advisory on GitHub.
3. Provide a minimal reproduction, impact assessment, and affected browser versions.
4. We acknowledge reports within 48 hours and share a remediation ETA after triage.

## Scope & Threat Model
- Night City OS runs entirely in the browser; there is **no backend**. State is stored in a hybrid **IndexedDB** (metadata) and **OPFS** (binary) engine.
- AI integrations (e.g., Gemini) depend on user-provided keys injected via Vite environment variables. Keys must never be committed to git.
- File uploads stay client-side within the Origin Private File System (OPFS) sandbox.
- **Audit Logging**: All security events and permission decisions are logged to a persistent audit trail.

## Hardening Guidelines
- Keep dependencies updated via `npm audit` and GitHub Dependabot.
- Run `npm run lint` and `npm run test -- --run` before releases to ensure guardrails remain intact.
- Validate all new inputs through utilities in `src/utils/validation.js` and cover them with tests.
- Avoid storing sensitive personal data in the OS; treat the environment as an immersive simulation, not a secure vault.
- Respect browser autoplay policies: the Web Audio engine unlocks only after user gestures and never auto-captures microphone input.

## Incident Response
- On confirmed issues, we will publish a security advisory and patch release.
- Users should clear `localStorage` and update to the patched version once available.
