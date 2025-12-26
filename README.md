# 🌃 Night City OS

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-yellow?style=for-the-badge&logo=github)](https://github.com/Raoof128/night_city_os)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> "Wake up, Samurai. We have a city to burn."

Night City OS is a high-fidelity, interactive "Cyberdeck" simulation built with React. It transforms your browser into a futuristic operating system inspired by the world of Cyberpunk 2077, featuring draggable windows, functional apps, and AI-powered data processing.

---

## ⚡ Quick Start

### 1. Installation
```bash
git clone https://github.com/Raoof128/night_city_os.git
cd night_city_os
npm install
```

### 2. Run Locally
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🏗 System Architecture

The project is designed as a **Single-File Monolith** for maximum portability and rapid state sync. The core logic resides in `src/WinOS.jsx`.

### Core Layers:
- **System Layer**: Manages the boot sequence, global z-index sorting, and thermal-link shutdown.
- **Window Manager**: A specialized component wrapper handling drag-and-drop physics (via `framer-motion`), minimizing, and state persistence.
- **Persistence Layer**: Custom `localStorage` synchronization for windows, files, and system configurations.
- **App Ecosystem**: A modular suite of reactive components injected into the OS environment.

---

## 📦 Key Applications

### 🛠 Terminal (`cmd.exe`)
A functional command-line interface with history tracking.
- **Commands**: `hack`, `balance`, `clear`, `whoami`, `date`.

### 💰 Finance Tracker
A dashboard for managing your "Eddies" (Currency) and suspicious transactions.
- **AI Vision Integration**: Drag & drop a receipt image onto the desktop. The OS uses **Google Gemini 2.5 Flash** to extract the merchant name and total spent automatically.

### 🤝 Shared Spaces (NEW)
Collaborative finance suite for families and roommates.
- **Features**: Bill splitting, shared goals, role-based permissions, and gamified saving challenges.

### 🎵 Cyber-Amp
Visualizer-driven music player with track cycling, vinyl animations, and progress tracking.

### 🖥 Network Map
SVG-based animated node topology visualizer. Tracks active traces and ICE breaches in real-time.

---

## 🎨 Design Aesthetics

- **Official Palette**: High-contrast Yellow (#FCEE0A), Cyan-Blue (#00F0FF), and Arasaka Red (#FF003C).
- **Glitch Engine**: Custom CSS keyframes and `clip-path` animations simulate signal corruption.
- **Stealth Mode**: Toggleable CRT scanlines and grid overlays for tactical visibility.
- **CRT Vision**: Global scanline overlays and vignette effects for that analog-future feel.

---

## ⚙️ Configuration

### Gemini AI Integration
To enable automated receipt scanning, add your API key to a `.env` file:
```env
VITE_GEMINI_API_KEY=your_google_ai_key
```

### System Integrity
The OS includes a **Mobile Safeguard**. If accessed on a screen narrower than 768px, the system triggers a "Critical Error: Incompatible Hardware" lockout to preserve visual immersion.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License
Internal Use / Educational Purpose. Inspired by CD PROJEKT RED's Cyberpunk 2077.

---
*Maintained by [Raouf](https://github.com/Raoof128)*
