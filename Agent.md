# 🌃 Night City OS // Project Brief

**Codename:** NC_OS_V5_NEURAL
**Owner:** Raouf (Netrunner/Admin)
**Status:** PRODUCTION READY (Labs Update v5.8.0)
**Repository:** [https://github.com/Raoof128/night_city_os](https://github.com/Raoof128/night_city_os)

## ⚡ Executive Summary
Night City OS is a high-fidelity React-based Operating System simulation running directly in the browser. It emulates the aesthetic and functionality of a Cyberpunk 2077 "Cyberdeck" interface. It has evolved from a UI shell into a functional, modular environment with active state management, drag physics, simulated file systems, and advanced AI integration.

## 🛠️ Tech Stack & Dependencies
- **Core:** React 18+ (Context + Reducer Architecture)
- **State Management:** Custom Redux-lite Store (`osReducer`) + Typed Event Bus.
- **Persistence:** **Hybrid Storage Engine** (IndexedDB for metadata + OPFS for binary content).
- **Runtime:** **AppContainer Sandbox** with Permission Gates and Lazy Loading.
- **Security:** **Audit Logging**, **CSP**, and **Profile Isolation**.
- **Extras:** **Feature Flag System**, **Wallpaper Engine**, and **WASM-optimized Crypto**.
- **A11y:** **Focus Management**, **Keyboard Navigation**, **Font Scaling**, and **High Contrast**.
- **Testing:** Vitest + React Testing Library + Playwright.
- **CI/CD:** GitHub Actions (Lint, Test, Build)
- **Styling:** Tailwind CSS + CSS Variables (Dynamic Theming).

## 🏗️ Architecture (Modular V5 Kernel)
The OS features a fully modularized kernel architecture to support scalability and maintainability.
- **Kernel Layer (`src/os/kernel`):** 
    - **`EventBus`:** Centralized system-wide messaging with history buffer and audit logging.
    - **`StorageKernel`:** Scoped to User Profiles.
    - **`AppContainer`:** Runtime isolation and capability injection.
    - **`PermissionManager`:** Gatekeeper for sensitive OS APIs.
    - **`registry.js`:** App Manifests + **Plugin Loader**.
- **Store Layer (`src/os/store`):** Single source of truth via `OSProvider` and `osReducer`.

## 📦 Key Features (v5.8 Updated - Labs & Extras)

### 1. OS Labs (Phase 8)
- **Feature Flags:** Toggle experimental features in Settings > Labs (Disabled by default).
- **Live Wallpaper:** Particle-based background engine with **Performance Guardrails** (pauses on low-power or reduced-motion).
- **Plugin System:** Secure dynamic registration of third-party manifests (Signed/Integrity checked).
- **Multi-Monitor Sim:** Virtual multi-display canvas environment.
- **Crypto Engine:** WASM-like SHA-256 integrity verification for system backups.

### 2. Accessibility & Quality (Phase 7)
- **Keyboard Mastery:** Fully usable via keyboard (Alt+Tab, Alt+W, Arrow keys for menus).
- **Adaptive UI:** Global font scaling (80%-150%), High Contrast, and Reduced Motion support.
- **Observability:** In-OS **Logs App** and **Diagnostic Bundle** export.

### 3. Security & Privacy (Phase 6)
- **Audit Log:** Immutable record of security events.
- **Profile Isolation:** Storage and settings scoped to `profileId`.
- **Lock Screen:** Session locking mechanism guarding the desktop.

### 4. Functional Applications (Phase 5)
- **Terminal:** Real filesystem commands (`ls`, `cat`, `mkdir`, `rm`).
- **File Explorer:** Tree/Grid navigation and external drive mounting.
- **Stubs:** Linux VM and NetRelay sync placeholders.

## 🧪 Engineering Runbook
- **Quality gates:** `npm run lint`, `npm run test:unit`, `npm run build`.
- **Labs:** Toggle flags in `Settings` -> `Labs` to test experimental features.
- **Performance:** Live wallpaper auto-disables if `reducedMotion` or `performanceMode` is active.
- **Env:** Provide `VITE_GEMINI_API_KEY` via `.env.local` for AI features.

## 🔮 V6.0 Roadmap // The "Brave New World" Update
- **Netrunner Relay:** P2P chat channel (Real WebRTC implementation).
- **Cloud Sync:** Real Supabase Integration for global profile persistence.
- **Gamification:** Breach Protocol mini-games and Cyberware inventory.