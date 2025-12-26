import logger from './logger';

/**
 * Normalize a file upload into a safe descriptor for UI consumption.
 * @param {File|Object} file - The file object provided by the browser.
 * @returns {{name: string, date: string, type: string, sizeKb: number}}
 */
export const createFileDescriptor = (file) => {
    if (!file) {
        throw new Error('File missing from upload event');
    }

    const name = typeof file.name === 'string' && file.name.trim() ? file.name.trim() : `shard_${Date.now()}.dat`;
    const type = typeof file.type === 'string' && file.type ? file.type : 'application/octet-stream';
    const sizeKb = file.size ? Math.max(1, Math.round(file.size / 1024)) : Math.floor(Math.random() * 5000);

    return {
        name,
        date: new Date().toLocaleDateString(),
        type,
        sizeKb
    };
};

/**
 * Validate and sanitize transaction payloads before they are persisted.
 * @param {{amount: number, summary?: string}} payload
 * @returns {{amount: number, summary: string}}
 */
export const validateTransactionPayload = (payload) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Transaction payload is required.');
    }

    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Amount must be a positive number.');
    }

    const summary = (payload.summary || '').toString().trim();
    if (!summary) {
        logger.warn('Transaction summary missing; using fallback label.');
    }

    return {
        amount,
        summary: summary || 'UNKNOWN'
    };
};
