# 🌃 Night City OS // Project Brief

**Codename:** NC_OS_V5_NEURAL
**Owner:** Raouf (Netrunner/Admin)
**Status:** STABLE (Hardened v5.8.1)
**Repository:** [https://github.com/Raoof128/night_city_os](https://github.com/Raoof128/night_city_os)

## ⚡ Executive Summary
Night City OS is a high-fidelity React-based Operating System simulation running directly in the browser. It emulates the aesthetic and functionality of a Cyberpunk 2077 "Cyberdeck" interface. It has evolved from a UI shell into a functional, modular environment with active state management, drag physics, simulated file systems, and advanced AI integration.

## 🛠️ Tech Stack & Dependencies
- **Core:** React 18+ (Context + Reducer Architecture)
- **State Management:** Custom Redux-lite Store (`osReducer`) + Typed Event Bus.
- **Persistence:** **Hybrid Storage Engine** (IndexedDB for metadata + OPFS for binary content).
- **Runtime:** **AppContainer Sandbox** with Permission Gates and Lazy Loading.
- **Security:** **Audit Logging**, **CSP**, **Import Bomb Protection**, and **Plugin Allowlisting**.
- **A11y:** **Focus Management**, **Spatial Navigation**, and **Adaptive UI** (Contrast/Reduced Motion).
- **Testing:** Vitest + React Testing Library (69+ Unit/Component tests).
- **CI/CD:** GitHub Actions (Lint, Test, Build)

## 🏗️ Architecture (Modular V5 Kernel)
The OS features a fully modularized kernel architecture.
- **Kernel Layer (`src/os/kernel`):** 
    - **`EventBus`:** System-wide messaging with audit logging.
    - **`StorageKernel`:** Profile-scoped IDB + OPFS storage.
    - **`AppContainer`:** Sandbox providing error boundaries and capability enforcement.
    - **`PermissionManager`:** Async request handling with user consent UI.
    - **`registry.js`:** App registry with **Hardened Plugin Loader** (Allowlisted).
- **Observability Layer:**
    - **`errorCapture`:** Console and global error interception.
    - **`performance`:** Real-time FPS monitoring and budget enforcement.

## 📦 Key Features (v5.8.1 Hardened)

### 1. Interaction & Inclusivity (Phase 7-10)
- **Keyboard Mastery:** Fully usable via keyboard (Alt+Tab, Arrows, Home/End).
- **Focus Control:** Robust focus trapping in windows, modals, and menus.
- **Adaptive Context Menu:** Right-click menus change based on target (Files vs Desktop).
- **Snap Layouts:** Hover-triggered UI for window organization.
- **Haptics & Audio:** Clicks, vibration, and "snap" sounds for interaction feedback.

### 2. Security & Labs
- **Hardened Imports:** Protection against deep-nesting and massive string bombs.
- **Sanitized Diagnostics:** Redacts secrets/PII from issue reports automatically.
- **Labs Framework:** Experimental features (Live Wallpaper, Multi-Monitor) are **OFF by default** and auto-suspend on performance lag.

### 3. Functional Applications
- **Terminal:** Real filesystem commands (`ls`, `cat`, `mkdir`, `rm`).
- **File Explorer:** Tree/Grid navigation, DND feedback, and drive mounting.
- **Text Pad:** Autosave enabled scratchpad.
- **Logs App:** Centralized view for Audit and Console logs.

## 🧪 Engineering Runbook
- **Quality gates:** `npm run lint`, `npm run test:unit`, `npm run build`.
- **A11y Checks:** Verify Tab cycling in windows and Escape to close.
- **Labs:** Toggle flags in `Settings` -> `Labs`.
- **Performance:** Wallpaper auto-disables if EMA frame-time exceeds 33ms.

## 🔮 V6.0 Roadmap // The "Brave New World" Update
- **Netrunner Relay:** P2P chat channel (Real WebRTC implementation).
- **Cloud Sync:** Real Supabase Integration for global profile persistence.
- **Local LLM:** On-device AI processing via WebGPU.