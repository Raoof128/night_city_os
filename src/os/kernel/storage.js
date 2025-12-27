import { openDB } from 'idb';
import { validateImport } from '../../utils/security';

const STORE_NODES = 'fs_nodes';
const STORE_MOUNTS = 'fs_mounts';
const STORE_SYS = 'sys_kv';

// Singleton storage instance
class StorageKernel {
    constructor() {
        this.db = null;
        this.opfsRoot = null;
        this.ready = false;
        this.profile = 'default';
        this.dbName = 'night_city_os_default';
    }

    setProfile(profileId) {
        this.profile = profileId || 'default';
        this.dbName = `night_city_os_${this.profile}`;
        this.ready = false; // Re-init needed
        this.db = null;
    }

    async init() {
        if (this.ready && this.db) return;

        // 1. Init IndexedDB (Profile Scoped)
        this.db = await openDB(this.dbName, 1, {
            upgrade(db) {
                // Nodes: metadata for files/folders
                if (!db.objectStoreNames.contains(STORE_NODES)) {
                    const nodeStore = db.createObjectStore(STORE_NODES, { keyPath: 'id' });
                    nodeStore.createIndex('parentId', 'parentId', { unique: false });
                }

                // Mounts: external drive handles
                if (!db.objectStoreNames.contains(STORE_MOUNTS)) {
                    db.createObjectStore(STORE_MOUNTS, { keyPath: 'id' });
                }

                // System: global OS state snapshots
                if (!db.objectStoreNames.contains(STORE_SYS)) {
                    db.createObjectStore(STORE_SYS);
                }
            }
        });

        // 2. Init OPFS (Profile Scoped)
        if (navigator.storage && navigator.storage.getDirectory) {
            const root = await navigator.storage.getDirectory();
            // Create/Get profile directory
            const profileDir = await root.getDirectoryHandle(this.profile, { create: true });
            // Ensure blob directory exists within profile
            this.opfsRoot = await profileDir.getDirectoryHandle('blobs', { create: true });
        }

        this.ready = true;
        console.log(`[Storage] Initialized for profile: ${this.profile}`);
    }

    // --- System Persistence ---

    async saveSysState(state) {
        if (!this.ready) await this.init();
        await this.db.put(STORE_SYS, state, 'snapshot');
    }

    async loadSysState() {
        if (!this.ready) await this.init();
        return await this.db.get(STORE_SYS, 'snapshot');
    }

    // --- Virtual File System ---

    async listNodes(parentId) {
        if (!this.ready) await this.init();
        return await this.db.getAllFromIndex(STORE_NODES, 'parentId', parentId);
    }

    async getNode(id) {
        if (!this.ready) await this.init();
        return await this.db.get(STORE_NODES, id);
    }

    async createNode(meta, blob = null) {
        if (!this.ready) await this.init();
        
        // 1. Save Blob to OPFS if file
        if (meta.type === 'file' && blob) {
            const fileHandle = await this.opfsRoot.getFileHandle(meta.id, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
        }

        // 2. Save Metadata to IDB
        await this.db.put(STORE_NODES, {
            ...meta,
            created: Date.now(),
            modified: Date.now()
        });
    }

    async readFile(id) {
        if (!this.ready) await this.init();
        const meta = await this.db.get(STORE_NODES, id);
        if (!meta) throw new Error('File not found');

        if (meta.type === 'folder') return { meta, blob: null };

        // Read from OPFS
        try {
            const fileHandle = await this.opfsRoot.getFileHandle(id);
            const file = await fileHandle.getFile();
            return { meta, blob: file };
        } catch (e) {
            console.error('OPFS Read Error', e);
            return { meta, blob: new Blob([''], { type: meta.mime }) };
        }
    }

    async deleteNode(id) {
        if (!this.ready) await this.init();
        const node = await this.db.get(STORE_NODES, id);
        if (!node) return;

        // If folder, recursively delete children
        if (node.type === 'folder') {
            const children = await this.listNodes(id);
            for (const child of children) {
                await this.deleteNode(child.id);
            }
        }

        // Delete blob if file
        if (node.type === 'file') {
            try {
                await this.opfsRoot.removeEntry(id);
            } catch (e) { /* ignore if missing */ }
        }

        await this.db.delete(STORE_NODES, id);
    }

    async moveNode(id, newParentId) {
        if (!this.ready) await this.init();
        const node = await this.db.get(STORE_NODES, id);
        if (node) {
            node.parentId = newParentId;
            node.modified = Date.now();
            await this.db.put(STORE_NODES, node);
        }
    }

    // --- Mounts (File System Access API) ---

    async mountDrive(dirHandle) {
        if (!this.ready) await this.init();
        const id = `mount-${Date.now()}`;
        
        await this.db.put(STORE_MOUNTS, {
            id,
            name: dirHandle.name,
            handle: dirHandle,
            type: 'local'
        });

        await this.createNode({
            id,
            parentId: 'root',
            name: dirHandle.name,
            type: 'mount',
            mountId: id
        });

        return id;
    }

    async clear() {
        if (!this.ready) await this.init();
        
        // 1. Clear IDB
        await this.db.clear(STORE_NODES);
        await this.db.clear(STORE_MOUNTS);
        await this.db.clear(STORE_SYS);

        // 2. Clear OPFS Blobs
        try {
            // We can't delete the root handle easily in all browsers, iterate entries
            // Or just delete the folder we created 'blobs'
            await this.opfsRoot.removeEntry('blobs', { recursive: true }).catch(() => {});
            // Recreate empty
            // Actually this.opfsRoot IS 'blobs' handle. We need parent.
            const root = await navigator.storage.getDirectory();
            const profileDir = await root.getDirectoryHandle(this.profile);
            await profileDir.removeEntry('blobs', { recursive: true });
            this.opfsRoot = await profileDir.getDirectoryHandle('blobs', { create: true });
        } catch (e) {
            console.error('OPFS Clear Error', e);
        }
        
        console.log('[Storage] Wiped');
    }

    // --- Backup / Restore ---

    async exportBackup() {
        if (!this.ready) await this.init();
        
        // 1. Get State
        const sys = await this.loadSysState();
        const nodes = await this.db.getAll(STORE_NODES);
        
        // 2. Build Bundle (JSON + Base64 Blobs - Simple approach)
        // For larger systems, use Zip. Here we keep it JSON for text files mainly.
        // Binary files will be skipped in this JSON export for MVP safety/size.
        
        return JSON.stringify({
            version: '5.5.0',
            profile: this.profile,
            timestamp: Date.now(),
            sys,
            fs: { nodes }
        }, null, 2);
    }

    async importBackup(jsonString) {
        if (!this.ready) await this.init();
        
        // 5MB Limit
        if (jsonString.length > 5 * 1024 * 1024) {
            throw new Error('Import file too large (max 5MB)');
        }

        let data;
        try {
            data = JSON.parse(jsonString);
            validateImport(data); // Using shared validator
        } catch (e) {
            throw new Error(`Import Failed: ${e.message}`);
        }

        // Restore State
        if (data.sys) await this.saveSysState(data.sys);
        
        // Restore FS Nodes
        if (data.fs && data.fs.nodes) {
            const tx = this.db.transaction(STORE_NODES, 'readwrite');
            // Assuming nodes is an object in storage, but backup might have it as array/object
            const nodesToRestore = Array.isArray(data.fs.nodes) ? data.fs.nodes : Object.values(data.fs.nodes);
            await Promise.all(nodesToRestore.map(node => tx.store.put(node)));
            await tx.done;
        }

        return true;
    }
}

export const storage = new StorageKernel();
