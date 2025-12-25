# 🌃 Night City OS // Project Brief

**Codename:** NC_OS_V3_FINAL  
**Owner:** Raouf (Netrunner/Admin)  
**Status:** PRODUCTION READY (v3.2 Production Audit Complete)  
**Repository:** [https://github.com/Raoof128/night_city_os](https://github.com/Raoof128/night_city_os)

## ⚡ Executive Summary
Night City OS is a high-fidelity React-based Operating System simulation running directly in the browser. It emulates the aesthetic and functionality of a Cyberpunk 2077 "Cyberdeck" interface. It has evolved from a UI shell into a functional environment with active state management, drag physics, and simulated file systems.

## 🛠️ Tech Stack & Dependencies
- **Core:** React 18+ (Functional Components, Hooks)
- **Animation Physics:** framer-motion (Spring physics for windows, drag interactions, toast animations)
- **Testing:** Vitest + React Testing Library (Unit & Integration)
- **CI/CD:** GitHub Actions (Lint, Test, Build)
- **Styling:** Tailwind CSS + CSS Variables (Dynamic Theming) + Google Fonts (Rajdhani, Share Tech Mono)
- **Icons:** lucide-react
- **AI Integration:** Google Gemini 2.5 Flash (via REST API) for Computer Vision (Receipt Scanning).

## 🏗️ Architecture (Single File Mandate)
The OS is designed with a hybrid monolithic-modular approach. Core layout remains in `WinOS.jsx` for state synchronization, while logic is externalized.
- **System Layer:** Handles Boot Sequence, Shutdown/Reboot, Desktop Environment (Z-index, Dragging), and Global State.
- **Persistence Layer:** `usePersistentState.js` (Custom Hook) with error safety.
- **Modularity:**
-   **Hooks:** `usePersistentState.js`, `useViewport.js`
-   **Styles:** `tokens.js` (Design tokens), `index.css` (CSS Variables)
-   **Utils:** `helpers.js` (Formatting, class merging)
- **Window Manager:** A higher-order component (`WindowFrame`) that wraps apps.
- **Z-Index Logic:** Implements `bringToFront(id)` to dynamically sort active windows.
- **App Ecosystem:** Modular components injected into windows.

## 📦 Key Features (v3.0 Final)

### 1. The "Arasaka" Interface
- **Palette:** Strict adherence to `#FCEE0A` (Yellow), `#FF003C` (Red), `#00F0FF` (Blue), and `#000000` (Void).
- **Visuals:** CRT Scanlines, Grid Overlays, Glitch animations.
- **Stealth Mode:** Toggleable via Context Menu to reduce visual noise (removes CRT/Grid layers).

### 2. Functional Applications
- **cmd.exe (Terminal):** Functional CLI. Parses commands (`hack`, `balance`, `whoami`, `clear`, `date`). Maintains history state.
- **Finance Tracker:** Displays live "Eddies" (Currency).
    - **AI Feature:** Users drag & drop a receipt photo onto the desktop widget. Gemini 2.5 Flash analyzes it and updates the spending graph/transaction list automatically.
- **Text Pad:** Fully functional scratchpad (`<textarea>`) that simulates saving state.
- **Image Viewer:** Simulates decryption of "Data Shards" (files) when double-clicked.
- **Network Map:** SVG-based animated node topology visualization.

### 3. Desktop Environment
- **Context Menu:** Custom Right-Click menu replacing browser defaults.
    - **Features:** Reset Grid, Toggle Stealth Mode, Run Diagnostics.
    - **Logic:** Auto-closes on interaction or outside click.
- **Draggable Everything:** Icons, Widgets (Calendar, Upload), and Windows use framer-motion drag controls.
- **Notifications:** "Toast" system for system-wide alerts (e.g., "Scan Complete", "Grid Reset").
### 4. New Core Applications (v3.1)
- **Calculator:** Functional arithmetic with precision fixes for floating point math.
- **Music Player ("Cyber-Amp"):** Visualizer-based media player with track cycling, progress bars, and vinyl animations.
- **Settings App:** System configuration tool.
    - **Wallpapers:** Toggle Background Fit (Cover/Contain/Fill).
    - **Volume:** Visual master fader.
    - **User Profile:** Identity card display.

### 5. Advanced Visuals (v3.1)
- **Glitch Engine:** Custom CSS keyframe animations simulating signal corruption on text and overlays.
- **Mobile Safeguard:** "System Incompatible" security lockout screen for viewports < 768px.
- **Dynamic Backgrounds:** User-configurable wallpaper scaling.

## ⚠️ Developer Notes for Agents
- **API Keys:** The Gemini API key is injected at runtime. Do **not** hardcode.
- **State Management:**
    - `windows` array manages open apps.
    - `financeData` state is lifted to `WinOS` to allow the Upload Widget to update the Tracker App.
    - `desktopKey` is used to force-remount the desktop div to implement the "Reset Grid" feature.
    - Clicking a window must trigger `bringToFront`.
    - Right-Clicking the background triggers `handleContextMenu` and prevents default browser behavior.
- **Persistence:**
    - `localStorage` is used for `os_windows` (open apps), `os_files` (created files), and `os_config`.
    - Includes `try-catch` blocks to prevent crashes from corrupted storage.