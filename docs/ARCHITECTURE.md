# 🛠 Technical Architecture: Night City OS

This document outlines the internal workings and design decisions behind the Night City OS simulation.

## 1. State Management Pattern

The OS utilizes a **Centralized State Model** within the `WinOS` component. This allows for seamless interaction between apps (e.g., uploading a file on the desktop and seeing it appear in the Finance Tracker).

### Key State Objects:
- `windows`: Array of objects tracking `{ id, title, icon, isMinimized, zIndex, pos }`.
- `financeData`: Tracks `balance`, `spent`, and `recent` transactions.
- `files`: A virtual file system array for user-uploaded "Data Shards".
- `stealthMode`: Global boolean for visual filters.

## 2. Window Management & Z-Index

To simulate a real desktop, we implement a `bringToFront(id)` function:

```javascript
const bringToFront = (id) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex || 0), 10);
    setWindows(windows.map(w => 
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
    ));
};
```

This ensures that the currently clicked window always renders on top of others.

## 3. Storage Persistence

The OS implements a `useEffect` hook to synchronize state with `localStorage`. To prevent system crashes from malformed JSON in storage, all reads are wrapped in `try-catch` blocks with safe default fallbacks.

## 4. AI Vision Pipeline (Gemini 2.5)

The Finance App integration follows this flow:
1. **Drop Event**: User drops a JPEG/PNG onto the `DesktopUploadWidget`.
2. **Buffer Read**: The file is converted to a Base64 string.
3. **REST API Call**: A payload is sent to Gemini 2.5 Flash with a specific system prompt to return **Strict JSON**.
4. **State Injection**: The returned amount and merchant name are injected into the `financeData` state, triggering a notification toast.

## 5. Visual Rendering Engine

### CRT & Scanlines
Implemented using a fixed-position overlay with a repeating linear gradient:
```css
background: linear-gradient(
  rgba(18, 16, 16, 0) 50%, 
  rgba(0, 0, 0, 0.25) 50%
), 
linear-gradient(
  90deg, 
  rgba(255, 0, 0, 0.06), 
  rgba(0, 255, 0, 0.02), 
  rgba(0, 0, 255, 0.06)
);
background-size: 100% 4px, 3px 100%;
```

### Glitch Effects
Uses `clip-path` to create "slices" of an element that jump horizontally during animation, creating the illusion of signal interference.
