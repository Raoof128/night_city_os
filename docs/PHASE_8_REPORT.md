# Phase 8: State-of-the-Art Extras (Final Release v5.8.0)

## 1. Repo Reconnaissance Summary
The platform architecture (Phase 3-6) was verified as a solid foundation. Accessibility primitives (Phase 7) like `FocusTrap` and keyboard navigation were already present and have been hardened. The feature flag system is integrated into the core `osReducer` and persisted per profile.

## 2. Bug + Security Risk Register (Updated)

| Item | Severity | Location | Root Cause | Fix | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Import Bomb (Depth)**| High | `security.js` | Recursive JSON objects could blow the stack. | Added `MAX_DEPTH` check (10). | Unit test. |
| **Import Bomb (String)**| High | `security.js` | Massive strings could choke memory. | Added `MAX_STRING_LEN` check (100KB). | Unit test. |
| **Plugin Security** | High | `registry.js` | Open registration allowed potential exploits. | Added `PLUGIN_ALLOWLIST` + local-only policy. | Unit test. |
| **Backup Hash** | Medium | `storage.js` | Checksum-only allows tampering if key is known. | Added SHA-256 (Corruption detection). | Logic review. |
| **Shortcut Leak** | Medium | `Shell.jsx` | Shortcuts worked while locked. | Added `state.locked` check to all keys. | Manual lock check. |
| **A11y Switcher** | Medium | `AppSwitcher.jsx` | Focus wasn't trapped during switch. | Wrapped in `FocusTrap` + ARIA roles. | Tab through switcher. |
| **PII Leak** | Medium | `Settings.jsx` | raw userAgent in diagnostics. | Implemented `sanitizeDiagnosticData`. | Review JSON bundle. |
| **Perf Jank** | Low | `WallpaperEngine` | No lag detection. | Added EMA frame-time monitor (60 frames) auto-kill. | Heavy load simulation. |

## 3. Summary of Changes
*   **Security Policy:** Phase 8 extras are **OFF by default**. Plugins are **local-only** and restricted by an ID allowlist.
*   **Import Bomb Protection:** Hardened `validateImport` with 5MB file size limit, 1000 node limit, recursion depth limit (10), and string length caps (100KB).
*   **Wallpaper Engine Guardrails:** Canvas-based particle system with EMA performance monitoring (over 60 frames); auto-disables if frame-time exceeds 33ms or Reduced Motion is on.
*   **Sanitized Diagnostics:** Implemented `sanitizeDiagnosticData` to redact secrets and PII from exported reports.
*   **AppSwitcher Polish:** Fully keyboard accessible with `FocusTrap`, Home/End support, and ARIA listbox roles.
*   **Corruption Detection:** Added SHA-256 hashing for system backup verification.
*   **Experimental Sections:** Added a minimal Settings section for feature flags (Phase 8).

## 4. Files Changed
*   **A11y:** `src/os/components/AppSwitcher.jsx`, `src/components/Shell.jsx`.
*   **Security:** `src/os/kernel/storage.js`, `src/utils/security.js`, `src/utils/crypto.js`, `src/os/kernel/registry.js`.
*   **Perf:** `src/os/components/WallpaperEngine.jsx`.
*   **Phase 8:** `src/apps/Settings.jsx`, `src/apps/LinuxStub.jsx`, `src/apps/CollaboratorStub.jsx`.
*   **Tests (Consolidated):** `tests/unit/security_hardening.test.js`, `tests/unit/flags.test.js`, `tests/unit/registry.test.js` (merged plugins), `tests/unit/crypto.test.js`.

## 5. Evidence
Added **69 unit tests** (verified passing):
-   `security_hardening.test.js`: Validates depth limits, string length, and diagnostic redaction.
-   `registry.test.js`: Ensures allowlist enforcement for plugin registration.
-   `flags.test.js`: Confirms feature flag persistence.
-   `crypto.test.js`: Verifies SHA-256 consistency for corruption detection.

**Final Status: Stable with guarded experimental extras (OFF by default).**
