/**
 * Cryptographic utilities.
 * Uses Web Crypto API (frequently WASM-optimized in modern browsers).
 */

export const hashContent = async (content) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Validates integrity of a backup bundle.
 */
export const verifyIntegrity = async (data, expectedHash) => {
    const actualHash = await hashContent(JSON.stringify(data));
    return actualHash === expectedHash;
};
