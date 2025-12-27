# Platform Architecture Spec

## 1. App Runtime Model
Apps are no longer raw React components but encapsulated modules defined by a `Manifest` and executed within an `AppContainer`.

### App Manifest Schema
```javascript
{
    id: 'app-id',
    name: 'App Name',
    icon: IconComponent,
    permissions: ['files:read', 'network'],
    fileHandlers: {
        'text/plain': 'default',
        '.md': 'edit'
    },
    component: lazy(() => import('./App'))
}
```

### App Container (Sandbox)
The `AppContainer` wraps the lazy-loaded app and provides a curated `AppContext` API. It acts as the boundary for:
*   **Error Handling:** Per-app "Blue Screen" if the component crashes.
*   **Capabilities:** Enforces permissions (e.g., blocking `fs.write` if not granted).
*   **Lifecycle:** Injects status (`active`, `suspended`) props.

## 2. Permission System
Permissions are granular and user-controlled.
*   **State:** Persisted in `osReducer` as `{ appId: { perm: 'granted'|'denied' } }`.
*   **Manager:** `PermissionManager` handles logic: check -> if prompt needed -> request -> wait for UI -> resolve.
*   **UI:** Modal prompt (`PermissionPrompt.jsx`) triggered via EventBus/Redux loop.

### Supported Permissions
*   `files:read` / `files:write` / `files:manage`
*   `clipboard:read` / `clipboard:write`
*   `network:scan`
*   `mount:manage`

## 3. Inter-App Integration
*   **File Handlers:** Central registry (`SYSTEM_APPS`) maps MIME types/extensions to App IDs. `FileExplorer` uses `resolveFileHandler` to dispatch `openWindow`.
*   **Clipboard:** `ClipboardManager` wraps `navigator.clipboard` with permission checks and local fallback.

## 4. Lifecycle
*   **Active:** Window is focused.
*   **Background:** Window is open but not focused.
*   **Suspended:** Window is minimized.
*   Apps receive this state via `useApp().lifecycle`.

---

# Phase 3 Report

## 1. Execution Summary
We successfully transformed the monolithic `Shell` architecture into a modular Platform Runtime.
*   **Registry:** Apps are now defined in `src/os/kernel/registry.js` with metadata.
*   **Runtime:** `AppContainer` isolates apps and injects a protected API.
*   **Security:** Permissions are enforced for Filesystem and Clipboard operations.
*   **Integration:** Files now open in their associated apps dynamically.

## 2. File-by-File Change List
*   `src/os/kernel/registry.js`: (New) Central App Manifest definition.
*   `src/os/kernel/AppContainer.jsx`: (New) Runtime wrapper with Error Boundary & API Injection.
*   `src/os/kernel/PermissionManager.js`: (New) Permission logic & async request handling.
*   `src/os/kernel/Clipboard.js`: (New) Secure clipboard wrapper.
*   `src/os/components/PermissionPrompt.jsx`: (New) System modal for allowing/denying permissions.
*   `src/components/Shell.jsx`: Refactored to use `SYSTEM_APPS` and `AppContainer`.
*   `src/os/store/osReducer.js`: Added `permissions` state and actions.
*   `src/os/store/OSProvider.jsx`: Exposed `resolvePermission` and injected `permissions` into persistence.
*   `src/apps/FileExplorer.jsx`: Updated to use `resolveFileHandler` for opening files.

## 3. Acceptance Checklist
- [x] **Lazy Loading:** Apps load chunks only on demand (verified via build output).
- [x] **Crash Isolation:** App crash shows "RESTART" button, OS stays stable.
- [x] **Permissions:**
    - [x] Prompt appears on restricted action.
    - [x] "Allow" proceeds, "Deny" throws error.
    - [x] Choices persist across reloads.
- [x] **Open With:** Text files open in TextPad automatically.
- [x] **Clipboard:** Copy/Paste works with permission check.
- [x] **Lifecycle:** Apps receive `suspended` state when minimized.

## 4. Build Verification
- Command: `npm run build`
- Status: **PASSED**
