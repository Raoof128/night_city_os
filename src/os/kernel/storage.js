import { openDB } from 'idb';

const DB_NAME = 'night_city_os_v1';
const STORE_NODES = 'fs_nodes';
const STORE_MOUNTS = 'fs_mounts';
const STORE_SYS = 'sys_kv';

// Singleton storage instance
class StorageKernel {
    constructor() {
        this.db = null;
        this.opfsRoot = null;
        this.ready = false;
    }

    async init() {
        if (this.ready) return;

        // 1. Init IndexedDB
        this.db = await openDB(DB_NAME, 1, {
            upgrade(db) {
                // Nodes: metadata for files/folders
                const nodeStore = db.createObjectStore(STORE_NODES, { keyPath: 'id' });
                nodeStore.createIndex('parentId', 'parentId', { unique: false });

                // Mounts: external drive handles
                db.createObjectStore(STORE_MOUNTS, { keyPath: 'id' });

                // System: global OS state snapshots
                db.createObjectStore(STORE_SYS);
            }
        });

        // 2. Init OPFS
        if (navigator.storage && navigator.storage.getDirectory) {
            this.opfsRoot = await navigator.storage.getDirectory();
            // Ensure blob directory exists
            await this.opfsRoot.getDirectoryHandle('blobs', { create: true });
        }

        this.ready = true;
        console.log('[Storage] Initialized');
    }

    // --- System Persistence ---

    async saveSysState(state) {
        if (!this.ready) await this.init();
        // Exclude heavy items if necessary, but for now save clean snapshot
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
            const blobsDir = await this.opfsRoot.getDirectoryHandle('blobs');
            const fileHandle = await blobsDir.getFileHandle(meta.id, { create: true });
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
            const blobsDir = await this.opfsRoot.getDirectoryHandle('blobs');
            const fileHandle = await blobsDir.getFileHandle(id);
            const file = await fileHandle.getFile();
            return { meta, blob: file };
        } catch (e) {
            console.error('OPFS Read Error', e);
            // Fallback for empty/missing files
            return { meta, blob: new Blob([''], { type: meta.mime }) };
        }
    }

    async deleteNode(id) {
        if (!this.ready) await this.init();
        const node = await this.db.get(STORE_NODES, id);
        if (!node) return;

        // If folder, technically we should delete children recursively
        // For phase 2 prototype, we'll just soft-delete or assume empty
        // In a real OS, verify empty or recurse. Here we assume generic delete.

        // Delete blob if file
        if (node.type === 'file') {
            try {
                const blobsDir = await this.opfsRoot.getDirectoryHandle('blobs');
                await blobsDir.removeEntry(id);
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

        // Create a virtual node representing the mount in root
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
            const blobsDir = await this.opfsRoot.getDirectoryHandle('blobs');
            // Remove recursively to clear all files
            await blobsDir.removeEntry('blobs', { recursive: true });
            // Recreate empty
            await this.opfsRoot.getDirectoryHandle('blobs', { create: true });
        } catch (e) {
            console.error('OPFS Clear Error', e);
        }
        
        console.log('[Storage] Wiped');
    }
}

export const storage = new StorageKernel();
