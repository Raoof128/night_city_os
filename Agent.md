# 🌃 Night City OS // Project Brief

**Codename:** NC_OS_V5_NEURAL
**Owner:** Raouf (Netrunner/Admin)
**Status:** STABLE RELEASE (Verified Build v5.1.1)
**Repository:** [https://github.com/Raoof128/night_city_os](https://github.com/Raoof128/night_city_os)

## ⚡ Executive Summary
Night City OS is a high-fidelity React-based Operating System simulation running directly in the browser. It emulates the aesthetic and functionality of a Cyberpunk 2077 "Cyberdeck" interface. It has evolved from a UI shell into a functional, modular environment with active state management, drag physics, simulated file systems, and advanced AI integration.

## 🛠️ Tech Stack & Dependencies
- **Core:** React 18+ (Functional Components, Hooks)
- **Animation Physics:** framer-motion (Spring physics for windows, drag interactions, toast animations, charts)
- **Testing:** Vitest + React Testing Library (Unit & Integration)
- **CI/CD:** GitHub Actions (Lint, Test, Build)
- **Styling:** Tailwind CSS + CSS Variables (Dynamic Theming) + Google Fonts (Rajdhani, Share Tech Mono)
- **Icons:** lucide-react
- **AI Integration:** Google Gemini 2.5 Flash (via REST API) for:
    - Computer Vision (Receipt Scanning)
    - Audio Processing (Voice Note Expenses)
    - Financial Reasoning (Spending Insights & Anomaly Detection)
- **Validation & Telemetry:** Centralized input validation + prefixed logging (`src/utils/validation`, `src/utils/logger`) used for uploads and finance mutations.

## 🏗️ Architecture (Modular V4)
The OS features a fully modularized architecture to support scalability and maintainability.
- **System Layer (`WinOS.jsx`):** Orchestrates the Desktop Environment, Window Management, Z-Index Sorting, and Global State.
- **Persistence Layer:** `usePersistentState.js` handles local storage synchronization.
- **Component Library:**
    - **`WindowFrame`:** A reusable, glassmorphism-styled container handling drag, minimize, maximize, and close actions.
    - **`utils/theme`:** Centralized design tokens.
- **Application Layer:** Each app is an isolated module in `src/apps/`:
    - `FinancialTracker.jsx`, `Calculator.jsx`, `Terminal.jsx`, etc.

## 📦 Key Features (v5.1 Updated - Social Suite)

### 1. The "Arasaka" Interface (Glassmorphism Upgrade)
- **Palette:** Strict adherence to `#FCEE0A` (Yellow), `#FF003C` (Red), `#00F0FF` (Blue), and `#000000` (Void).
- **Aesthetic:** "Glass-morphism" windows with frosted backdrops, neon borders, and CRT/Glitch overlays.
- **Stealth Mode:** Toggleable via Context Menu to reduce visual noise.

### 2. Social & Collaborative Finance (NEW)
- **Shared Spaces:** Unified dashboard for Families, Roommates, or Couples.
    - **Roles & Permissions:** Admin/Editor/Viewer controls.
    - **Approval Workflows:** Transactions > Threshold require Admin approval.
- **Collaborative Tools:**
    - **Split The Bill:** Multi-user expense splitting.
    - **Shared Goals:** Collaborative savings targets.
    - **Group Challenges:** Gamified saving competitions.
    - **Shared Shopping Lists:** Real-time synced lists linked to budgets.

### 3. Functional Applications
- **cmd.exe (Terminal):** Functional CLI. Parses commands (`hack`, `balance`, `whoami`, `clear`, `date`). Maintains history state.
- **Finance Tracker (v2.5 Neural):**
    - **Dashboard:** Tabbed interface (Overview, Assets, Analytics, Simulation, Insights).
    - **Smart Intelligence:** Auto-categorization rules that learn from user input (Neural Training).
    - **Multi-Currency:** Live switching between €$, USD, JPY, BTC.
    - **Asset Management:** Tracking of physical assets and recurring subscriptions.
    - **Security:** Anomaly detection (>10k) and Tax Tagging.
    - **Input:** Drag & drop receipt analysis + Voice Note processing.
- **Text Pad:** Fully functional scratchpad (`<textarea>`) that simulates saving state.
- **Image Viewer:** Simulates decryption of "Data Shards" (files).
- **Network Map:** SVG-based animated node topology visualization.
- **Media Amp:** Music player with animated visualizers.

### 4. Desktop Environment
- **Context Menu:** Custom Right-Click menu replacing browser defaults.
    - **Features:** Reset Grid, Toggle Stealth Mode, Run Diagnostics.
    - **Logic:** Auto-closes on interaction or outside click.
- **Draggable Everything:** Icons, Widgets (Calendar, Upload), and Windows use framer-motion drag controls.
- **Notifications & Audit:** "Toast" system for alerts + "Restricted" Audit Log in Settings.
- **Natural Search:** Taskbar input supports natural language app launching.

## 🧪 Engineering Runbook
- **Quality gates:** `npm run lint`, `npm run test -- --run`, `npm run build`.
- **Env:** Provide `VITE_GEMINI_API_KEY` via `.env.local` when exercising AI receipt scanning.
- **State hygiene:** Persistent slices are stored in `localStorage`; clear storage to simulate a cold boot.
- **Permissions:** Finance mutations respect `spaces` roles; approvals enforced over configured thresholds.

## 🛡️ Security Notes
- Do not store secrets in the repo. Env keys are user-provided at runtime.
- Validation utilities must wrap new inputs before persistence to avoid corrupting saved state.
- Keep UI strings escaped and avoid unsafe HTML injection patterns.

## 🔮 V6.0 Roadmap // The "Brave New World" Update

### 🌐 Social & Multiplayer (Partially Shipped v5.1)
- **Netrunner Relay:** P2P chat channel with other "Netrunners" (simulated or WebRTC).
- **Leaderboards:** Global ranking based on "Savings Goal" progress.
- **(DONE) Shared Spaces & Split Bill.**

### 🎮 Gamification
- **Hacking Minigames:** Breach Protocol mini-game to unlock "Encrypted" files.
- **Cyberware Inventory:** RPG-style inventory system affecting OS stats (RAM, Speed).

### ☁️ Cloud Sync
- **Supabase Integration:** Real persistent user auth and data storage.
- **Device Handover:** Seamless state transfer between Mobile and Desktop.
