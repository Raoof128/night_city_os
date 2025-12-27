# 🌃 Night City OS // Project Brief

**Codename:** NC_OS_V5_NEURAL
**Owner:** Raouf (Netrunner/Admin)
**Status:** STABLE RELEASE (Platform Runtime v5.5.0)
**Repository:** [https://github.com/Raoof128/night_city_os](https://github.com/Raoof128/night_city_os)

## ⚡ Executive Summary
Night City OS is a high-fidelity React-based Operating System simulation running directly in the browser. It emulates the aesthetic and functionality of a Cyberpunk 2077 "Cyberdeck" interface. It has evolved from a UI shell into a functional, modular environment with active state management, drag physics, simulated file systems, and advanced AI integration.

## 🛠️ Tech Stack & Dependencies
- **Core:** React 18+ (Context + Reducer Architecture)
- **State Management:** Custom Redux-lite Store (`osReducer`) + Typed Event Bus.
- **Persistence:** **Hybrid Storage Engine** (IndexedDB for metadata + OPFS for binary content).
- **Runtime:** **AppContainer Sandbox** with Permission Gates and Lazy Loading.
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

## 🏗️ Architecture (Modular V5 Kernel)
The OS features a fully modularized kernel architecture to support scalability and maintainability.
- **Kernel Layer (`src/os/kernel`):** 
    - **`EventBus`:** Centralized system-wide messaging (Boot, Error, Window Ops) with history buffer.
    - **`StorageKernel`:** Abstraction over `idb` and `navigator.storage` (OPFS) for persistent data.
    - **`AppContainer`:** Runtime wrapper providing error boundaries, lifecycle events, and permission enforcement.
    - **`PermissionManager`:** Handles capability requests (`files:read`, `network`) with user prompts.
- **Store Layer (`src/os/store`):** Single source of truth via `OSProvider` and `osReducer`, handling Windows, Boot State, and Theme.
- **Shell Layer (`Shell.jsx`):** Orchestrates the Boot -> Desktop -> Shutdown lifecycle.
- **Component Library:**
    - **`WindowFrame`:** High-performance, 8-point resizable container with local state optimization and Snap/Tiling support.
    - **`Desktop` & `Taskbar`:** Decoupled functional components.
    - **`utils/theme`:** Centralized design tokens.
- **Application Layer:** Each app is an isolated module in `src/apps/`, defined by a **Manifest** in `registry.js`.

## 📦 Key Features (v5.5 Updated - Platform Runtime)

### 1. App Runtime & Security
- **Manifest System:** Apps define permissions, icons, and file handlers in a central registry.
- **Sandboxing:** Apps run inside `AppContainer` which intercepts crashes (Blue Screen) without bringing down the OS.
- **Permission Gates:** Sensitive actions (File Write, Network, Clipboard) trigger a "Allow/Deny" modal. Choices are persisted.
- **Code Splitting:** All apps are lazy-loaded on demand to ensure fast boot times.

### 2. The "Arasaka" Interface (Glassmorphism Upgrade)
- **Palette:** Strict adherence to `#FCEE0A` (Yellow), `#FF003C` (Red), `#00F0FF` (Blue), and `#000000` (Void).
- **Aesthetic:** "Glass-morphism" windows with frosted backdrops, neon borders, and CRT/Glitch overlays.
- **Stealth Mode:** Toggleable via Context Menu to reduce visual noise.
- **Window Management:** Snapping (Split/Quarter), Virtual Desktops (Spaces), and Minimize/Maximize animations.

### 3. Functional Applications
- **File Explorer:** Tree/Grid navigation, File System Access API mounting, and file operations.
- **cmd.exe (Terminal):** Functional CLI. Parses commands (`hack`, `balance`, `whoami`, `clear`, `date`). Maintains history state.
- **Finance Tracker (v2.5 Neural):** Smart categorization, multi-currency, asset management, and AI receipts.
- **Text Pad:** Fully functional scratchpad (`<textarea>`) reading/writing to real OPFS files.
- **Image Viewer:** Simulates decryption of "Data Shards" (files).
- **Network Map:** SVG-based animated node topology visualization.
- **Media Amp:** Music player with animated visualizers.

### 4. Desktop Environment
- **Context Menu:** Custom Right-Click menu replacing browser defaults.
- **Draggable Everything:** Icons, Widgets, and Windows use framer-motion drag controls.
- **Notifications & Audit:** "Toast" system + Notification Center history panel.
- **Quick Settings:** System Tray panel for Wifi, DND, Theme, and Performance toggles.
- **Natural Search:** Taskbar input supports natural language app launching.

## 🧪 Engineering Runbook
- **Quality gates:** `npm run lint`, `npm run test -- --run`, `npm run build`.
- **Env:** Provide `VITE_GEMINI_API_KEY` via `.env.local` when exercising AI receipt scanning.
- **State hygiene:** Persistent slices are stored in IndexedDB + OPFS; use "Hard Reset" in Recovery screen to wipe.
- **Permissions:** Finance mutations respect `spaces` roles; OS capabilities respect `permissions` state.
- **Audio Engine:** `useSound` lazily creates and unlocks the Web Audio context on user interaction.
- **Docs:** Mermaid diagrams are GitHub-compatible; validate new diagrams locally before committing.
- **Documentation Discipline:** Whenever system behavior changes (audio, window manager, finance), update README, ARCHITECTURE, CONTRIBUTING, SECURITY, and Changelogs in the same PR.

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
