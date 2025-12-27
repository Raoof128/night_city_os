export class ClipboardManager {
    constructor(permissionManager) {
        this.pm = permissionManager;
        this.localClipboard = null;
    }

    async readText(appId) {
        const status = await this.pm.request(appId, 'clipboard:read');
        if (status !== 'granted') throw new Error('Clipboard Read Denied');

        try {
            return await navigator.clipboard.readText();
        } catch (e) {
            // Fallback to local clipboard if system API fails (or not secure context)
            return this.localClipboard || '';
        }
    }

    async writeText(appId, text) {
        const status = await this.pm.request(appId, 'clipboard:write');
        if (status !== 'granted') throw new Error('Clipboard Write Denied');

        this.localClipboard = text;
        try {
            await navigator.clipboard.writeText(text);
        } catch (e) {
            console.warn('System clipboard write failed, using local fallback');
        }
    }
}
