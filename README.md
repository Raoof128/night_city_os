# 🌃 Night City OS v3.0

A Cyberpunk 2077 "Start Screen" / WebOS simulation running in React.

## ⚡ Running the Project

This project uses **Vite** + **React**.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## ⚙️ Configuration

### Gemini API Key (Optional)
To enable the receipt scanning feature (Gemini 2.5 Flash), create a `.env` file in the root directory:

```properties
VITE_GEMINI_API_KEY=your_api_key_here
```

## 📁 Project Structure

- `src/WinOS.jsx` - The main monolith component (OS Simulation).
- `src/index.css` - Global Tailwind directives.
- `src/main.jsx` - Entry point.

## 🛠 Features

- **Boot Sequence** & **Shutdown** screens.
- **Draggable Windows** & **Desktop Icons**.
- **Gemini Vision Integration** (Drag & Drop receipts).
- **Responsive Context Menu**.
- **Cyberpunk Aesthetics** (Scanlines, Glitch effects, Custom Scrollbars).
