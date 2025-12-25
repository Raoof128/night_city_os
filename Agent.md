# 🌃 Night City OS // Project Brief

**Codename:** NC_OS_V4_REFRACTED
**Owner:** Raouf (Netrunner/Admin)
**Status:** PRODUCTION READY (v3.5 Modular Audit Complete)
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
    - Financial Reasoning (Spending Insights)

## 🏗️ Architecture (Modular V4)
The OS features a fully modularized architecture to support scalability and maintainability.
- **System Layer (`WinOS.jsx`):** Orchestrates the Desktop Environment, Window Management, Z-Index Sorting, and Global State.
- **Persistence Layer:** `usePersistentState.js` handles local storage synchronization.
- **Component Library:**
    - **`WindowFrame`:** A reusable, glassmorphism-styled container handling drag, minimize, maximize, and close actions.
    - **`utils/theme`:** Centralized design tokens.
- **Application Layer:** Each app is an isolated module in `src/apps/`:
    - `FinancialTracker.jsx`, `Calculator.jsx`, `Terminal.jsx`, etc.

## 📦 Key Features (v3.5 Updated)

### 1. The "Arasaka" Interface (Glassmorphism Upgrade)
- **Palette:** Strict adherence to `#FCEE0A` (Yellow), `#FF003C` (Red), `#00F0FF` (Blue), and `#000000` (Void).
- **Aesthetic:** "Glass-morphism" windows with frosted backdrops, neon borders, and CRT/Glitch overlays.
- **Stealth Mode:** Toggleable via Context Menu to reduce visual noise.

### 2. Functional Applications
- **cmd.exe (Terminal):** Functional CLI. Parses commands (`hack`, `balance`, `whoami`, `clear`, `date`). Maintains history state.
- **Finance Tracker (v2.0):**
    - **Dashboard:** Tabbed interface (Overview, Analytics, AI Insights).
    - **Charts:** Animated Donut Charts and Trend lines using Framer Motion.
    - **AI Advisor:** Simulation of Gemini 2.5 analyzing spending patterns to offer optimization advice.
    - **Receipt Vision:** Drag & drop receipt analysis extracting category, merchant, and total.
- **Text Pad:** Fully functional scratchpad (`<textarea>`) that simulates saving state.
- **Image Viewer:** Simulates decryption of "Data Shards" (files).
- **Network Map:** SVG-based animated node topology visualization.
- **Media Amp:** Music player with animated visualizers.

### 3. Desktop Environment
- **Context Menu:** Custom Right-Click menu replacing browser defaults.
    - **Features:** Reset Grid, Toggle Stealth Mode, Run Diagnostics.
    - **Logic:** Auto-closes on interaction or outside click.
- **Draggable Everything:** Icons, Widgets (Calendar, Upload), and Windows use framer-motion drag controls.
- **Notifications:** "Toast" system for system-wide alerts.

### 4. Developer Notes for Agents
- **Architecture:** Do not add logic directly to `WinOS.jsx` if it fits in a standalone app component. Use `src/apps/` for new applications.
- **API Keys:** The Gemini API key is injected at runtime via `.env`.
- **State Management:**
    - `windows` array manages open apps.
    - `financeData` state is lifted to `WinOS` to allow the Upload Widget to update the Tracker App.
    - Clicking a window triggers `bringToFront`.
- **Build System:** Uses Vite with `import.meta.url` for path resolution compliance.