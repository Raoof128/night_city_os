import { lazy } from 'react';
import { 
    Terminal, Grid, Settings, Code2, Cpu, Monitor, 
    Bell, Share2, FileEdit, ShieldCheck, HardDrive, Globe 
} from 'lucide-react';

// Manifest Schema Definition (Implicit)
// id: string
// name: string
// icon: IconComponent
// permissions: string[]
// fileHandlers: { [mimeOrExt]: 'route' }
// component: LazyComponent

export const SYSTEM_APPS = {
    // 'tracker': {
    //     id: 'tracker',
    //     name: 'Financial Tracker',
    //     icon: Activity,
    //     permissions: ['files:read', 'files:write', 'network'],
    //     component: lazy(() => import('../../apps/FinancialTracker'))
    // },
    'terminal': {
        id: 'terminal',
        name: 'Terminal',
        icon: Terminal,
        permissions: ['system:admin'],
        component: lazy(() => import('../../apps/Terminal'))
    },
    'calc': {
        id: 'calc',
        name: 'Calculator',
        icon: Grid,
        permissions: [],
        component: lazy(() => import('../../apps/Calculator'))
    },
    'settings': {
        id: 'settings',
        name: 'Settings',
        icon: Settings,
        permissions: ['system:config'],
        component: lazy(() => import('../../apps/Settings'))
    },
    'icebreaker': {
        id: 'icebreaker',
        name: 'Icebreaker',
        icon: Code2,
        permissions: ['files:read', 'files:write', 'network'],
        component: lazy(() => import('../../apps/Icebreaker'))
    },
    'construct': {
        id: 'construct',
        name: 'Construct',
        icon: Cpu,
        permissions: ['ai:interact'],
        component: lazy(() => import('../../apps/Construct'))
    },
    'sysmon': {
        id: 'sysmon',
        name: 'SysMon',
        icon: Monitor,
        permissions: ['system:read'],
        component: lazy(() => import('../../apps/SysMon'))
    },
    'music': {
        id: 'music',
        name: 'Media Amp',
        icon: Bell,
        permissions: ['audio:play'],
        component: lazy(() => import('../../apps/MusicPlayer'))
    },
    'network': {
        id: 'network',
        name: 'Network Map',
        icon: Share2,
        permissions: ['network:scan'],
        component: lazy(() => import('../../apps/NetworkMap'))
    },
    'textpad': {
        id: 'textpad',
        name: 'TextPad',
        icon: FileEdit,
        permissions: ['files:read', 'files:write'],
        fileHandlers: {
            'text/plain': 'default',
            '.txt': 'default',
            '.md': 'default',
            '.json': 'default',
            '.js': 'default'
        },
        component: lazy(() => import('../../apps/TextPad'))
    },
    'vault': {
        id: 'vault',
        name: 'Vault',
        icon: ShieldCheck,
        permissions: ['storage:secure'],
        component: lazy(() => import('../../apps/Vault'))
    },
    'files': {
        id: 'files',
        name: 'File Explorer',
        icon: HardDrive,
        permissions: ['files:manage', 'mount:manage'],
        component: lazy(() => import('../../apps/FileExplorer'))
    },
    'media': {
        id: 'media',
        name: 'Media Viewer',
        icon: Monitor,
        permissions: ['files:read'],
        fileHandlers: {
            'image/png': 'default',
            'image/jpeg': 'default',
            'video/mp4': 'default',
            '.png': 'default',
            '.jpg': 'default',
            '.mp4': 'default'
        },
        component: lazy(() => import('../../apps/MediaViewer'))
    },
    'logs': {
        id: 'logs',
        name: 'System Logs',
        icon: Share2,
        permissions: ['system:read'],
        component: lazy(() => import('../../apps/Logs'))
    },
    'linux': {
        id: 'linux',
        name: 'Linux Runtime',
        icon: Terminal,
        permissions: ['system:admin'],
        component: lazy(() => import('../../apps/LinuxStub'))
    },
    'relay': {
        id: 'relay',
        name: 'NetRelay',
        icon: Globe,
        permissions: ['network:connect'],
        component: lazy(() => import('../../apps/CollaboratorStub'))
    }
};

/**
 * Plugin Registry & Registration
 * 
 * SECURITY POLICY:
 * 1. Only local plugins can be registered (baked-in or file-loaded).
 * 2. Plugins run within the same origin but are logic-isolated by AppContainer.
 * 3. Registration is restricted by a PLUGIN_ALLOWLIST.
 */

let pluginApps = {};

const PLUGIN_ALLOWLIST = ['test-plugin', 'community-theme-pack'];

export const registerPlugin = (manifest) => {
    // 1. Identity Check
    if (!manifest.id || !manifest.component) return false;
    
    // 2. Authorization Check (Allowlist)
    if (!PLUGIN_ALLOWLIST.includes(manifest.id)) {
        console.warn(`[Security] Blocked unauthorized plugin registration: ${manifest.id}`);
        return false;
    }

    pluginApps[manifest.id] = {
        ...manifest,
        isPlugin: true
    };
    return true;
};

export const getAppManifest = (id) => SYSTEM_APPS[id] || pluginApps[id];

export const getAllApps = () => ({ ...SYSTEM_APPS, ...pluginApps });

export const resolveFileHandler = (filename, mimeType) => {
    // Simple exact match for now
    for (const app of Object.values(getAllApps())) {
        if (!app.fileHandlers) continue;
        
        // Check mime
        if (mimeType && app.fileHandlers[mimeType]) return app.id;
        
        // Check extension
        const ext = '.' + filename.split('.').pop();
        if (app.fileHandlers[ext]) return app.id;
    }
    return null;
};
