# 🌃 Night City OS

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-yellow?style=for-the-badge&logo=github)](https://github.com/Raoof128/night_city_os)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Night City OS is a production-grade, browser-based operating system simulation inspired by Cyberpunk 2077. It ships with draggable glassmorphism windows, functional finance tooling, AI-powered receipt parsing, animated network visualizations, and a configurable desktop environment.

---

## 🚀 Highlights
- **Modular desktop**: Window manager with drag physics, minimization, z-index orchestration, and mobile-aware layout.
- **Finance suite**: Shared spaces, permissions, anomaly detection, receipt scanning, and gamified savings quests.
- **Productivity tools**: Terminal, calculator, scratchpad, music amp, network map, image viewer, and start menu search.
- **Resilience first**: Persistent state via `localStorage`, guarded input validation, and defensive logging around user uploads and transactions.
- **Theming**: Arasaka palette with CRT overlays, neon grids, and toggleable stealth/privacy modes.

---

## 🗺️ Architecture Overview

```mermaid
flowchart TD
    User([User]) --> UI[WinOS Shell]
    UI --> WM[Window Manager]
    UI --> Widgets[Desktop Widgets]
    WM --> Apps[Applications Registry]
    Apps --> Finance[FinancialTracker]
    Apps --> TerminalApp[Terminal]
    Apps --> Media[MusicPlayer]
    Apps --> SettingsApp[Settings]
    Finance --> Storage[usePersistentState (localStorage)]
    SettingsApp --> Theme[Theme Tokens]
    Widgets --> Upload[DesktopUploadWidget]
    Upload --> Validation[Validation Utilities]
    Validation --> Finance
    subgraph Security & Telemetry
        Validation -. guards .-> Logger[(Logger)]
        Logger -. audit .-> Audit[Audit Log]
    end
    Storage -. sync .-> UI
```

Additional design details live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 🧱 Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS, custom design tokens, glassmorphism overlays
- **Animation**: framer-motion
- **Testing**: Vitest + React Testing Library
- **Tooling**: ESLint, Prettier, Husky, lint-staged, GitHub Actions CI

---

## 🏁 Quickstart
1. **Install prerequisites**
   - Node.js 20+
   - npm 9+
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the OS locally**
   ```bash
   npm run dev
   ```
4. **Production build**
   ```bash
   npm run build
   ```
5. **Preview the production bundle**
   ```bash
   npm run preview
   ```

### Environment variables
Create a `.env.local` (or `.env`) file for client-side keys:
```env
VITE_GEMINI_API_KEY=your_google_ai_key
```
These values remain in the browser; do not commit secrets to the repository.

### Quality gates
| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint with React + hooks rules. |
| `npm run format` | Prettier formatting for JS/JSX/CSS. |
| `npm run test -- --run` | Vitest unit/integration test run. |
| `npm run test:coverage` | Coverage report. |
| `npm run build` | Production bundle validation. |

---

## 🧭 Repository Layout
```
.
├── src/               # Application source
│   ├── WinOS.jsx      # Desktop shell and window manager
│   ├── apps/          # Modular applications (Finance, Terminal, etc.)
│   ├── components/    # Shared UI building blocks
│   ├── hooks/         # Reusable hooks (persistence, viewport)
│   └── utils/         # Theming, validation, logging, helpers
├── tests/             # Vitest suite + setup
├── docs/              # Architecture and user manuals
├── public/            # Static assets served by Vite
└── .github/workflows/ # CI configuration
```

---

## 🧩 Applications & Controls
- **Command palette**: `Cmd/Ctrl + K`
- **Privacy mode**: `Cmd/Ctrl + Shift + P`
- **Stealth mode**: Toggle via right-click context menu
- **Receipt scanner**: Drop images on the Desktop Upload widget; validated, categorized transactions appear in Finance.
- **Taskbar search**: Natural language search to open apps.
- **Shared spaces**: Role-based finance management with approval workflows and audit logging.

For feature-by-feature guidance, see [`docs/USER_MANUAL.md`](docs/USER_MANUAL.md).

---

## 🔒 Security & Data Handling
- All state persists in `localStorage`; avoid storing personal secrets or credentials.
- Client-side validation guards file uploads and transaction inputs to prevent corrupt state.
- Environment keys (e.g., Gemini) must be provided by the user at runtime and never checked into git.
- See [`SECURITY.md`](SECURITY.md) for reporting guidelines and supported versions.

---

## 🤝 Contributing
1. Fork and branch from `main`.
2. Run linting and tests before opening a PR.
3. Update documentation alongside code changes.
4. Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📜 License
MIT License © Night City OS maintainers. See [`LICENSE`](LICENSE) for details.
