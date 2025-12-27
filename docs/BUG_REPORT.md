# Bug & Polish Report

## 1. System Map
*   **Core:** `WinOS.jsx` (Shell) -> `OSProvider` (State) -> `StorageKernel` (Persistence).
*   **Data Flow:** Actions -> Reducer -> State -> UI. Side effects -> Storage/EventBus.
*   **Storage:** Hybrid model with `IndexedDB` for metadata (fast) and `OPFS` for content (efficient).
*   **Safety:** `GlobalErrorFallback` wraps the app, now with IDB wiping capabilities.

## 2. Bug & Risk Register (Resolved)

| Issue | Severity | Status | Fix |
| :--- | :--- | :--- | :--- |
| **Recovery doesn't clear IDB** | High | **FIXED** | Added `storage.clear()` to `GlobalErrorFallback`. |
| **Missing Logs in Recovery** | Medium | **FIXED** | Added history buffer to `EventBus` and UI to Error Boundary. |
| **Snap Size Loss** | Low | **FIXED** | Added `preSnapSize` persistence to `osReducer`. |
| **Focus Logic** | Low | **FIXED** | Closing a window now focuses the next top window. |
| **Accessibility** | Medium | **FIXED** | Added `aria-label` to icon-only buttons in Taskbar, WindowFrame, Explorer. |
| **Docs Outdated** | Low | **FIXED** | Updated `README.md` and `ARCHITECTURE.md`. |

## 3. Patch Plan Execution
1.  **Hard Reset:** Implemented `storage.clear()` in `src/os/kernel/storage.js`.
2.  **Logging:** Updated `src/os/kernel/eventBus.js` and `src/os/components/GlobalErrorFallback.jsx`.
3.  **Window Manager:** Refined `src/os/store/osReducer.js`.
4.  **A11y:** Polished `Taskbar.jsx`, `WindowFrame.jsx`, `FileExplorer.jsx`.
5.  **Docs:** Synced documentation.

## 4. Final Acceptance Checklist (Manual Verification)
- [x] **Boot:** Loads without error.
- [x] **Crash:** `GlobalErrorFallback` shows logs and "Hard Reset" wipes IDB.
- [x] **Windows:** Snap/Max/Restore preserves original size. Closing focuses next.
- [x] **Storage:** Data persists to IDB/OPFS.
- [x] **A11y:** Screen readers announce buttons correctly.
- [x] **Build:** `npm run build` passes.

## 5. Run Instructions
```bash
npm install
npm run dev
```
(Requires a browser with OPFS support: Chrome, Edge, Firefox, Safari 15.2+)
