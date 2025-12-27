import { openDB } from 'idb';

const DB_NAME = 'night_city_audit_v1';
const STORE_LOGS = 'audit_logs';

class AuditLogger {
    constructor() {
        this.db = null;
        this.ready = false;
    }

    async init() {
        if (this.ready) return;
        this.db = await openDB(DB_NAME, 1, {
            upgrade(db) {
                const store = db.createObjectStore(STORE_LOGS, { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp');
                store.createIndex('action', 'action');
                store.createIndex('appId', 'appId');
            }
        });
        this.ready = true;
    }

    /**
     * Log a security or sensitive system event.
     * @param {Object} entry 
     * @param {string} entry.action - ACTION_TYPE
     * @param {string} entry.appId - Source App ID
     * @param {string} entry.target - Target resource (fileId, etc)
     * @param {string} entry.outcome - 'allow' | 'deny' | 'error' | 'info'
     * @param {string} entry.details - Optional extra info
     */
    async log(entry) {
        if (!this.ready) await this.init();
        
        const record = {
            ...entry,
            timestamp: Date.now()
        };

        try {
            await this.db.add(STORE_LOGS, record);
        } catch (e) {
            console.error('Audit Log Failed:', e);
        }
    }

    async getLogs(limit = 100) {
        if (!this.ready) await this.init();
        const tx = this.db.transaction(STORE_LOGS, 'readonly');
        const index = tx.store.index('timestamp');
        // Get last N logs (cursor direction prev)
        let cursor = await index.openCursor(null, 'prev');
        const logs = [];
        
        while (cursor && logs.length < limit) {
            logs.push(cursor.value);
            cursor = await cursor.continue();
        }
        
        return logs;
    }

    async clearLogs() {
        if (!this.ready) await this.init();
        await this.db.clear(STORE_LOGS);
    }
}

export const auditLogger = new AuditLogger();
