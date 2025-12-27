// Simple in-memory search index for Phase 4
// In a real app, this would run in a Web Worker

class FileIndexer {
    constructor() {
        this.index = []; // { id, name, type, contentSnippet }
    }

    add(fileNode, content = '') {
        this.index = this.index.filter(i => i.id !== fileNode.id);
        this.index.push({
            id: fileNode.id,
            name: fileNode.name,
            type: fileNode.type,
            content: content.slice(0, 1000).toLowerCase() // Index first 1k chars
        });
    }

    remove(id) {
        this.index = this.index.filter(i => i.id !== id);
    }

    search(query) {
        const q = query.toLowerCase();
        return this.index.filter(item => 
            item.name.toLowerCase().includes(q) || 
            item.content.includes(q)
        ).map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            score: item.name.toLowerCase().includes(q) ? 10 : 5
        })).sort((a, b) => b.score - a.score);
    }
}

export const fileIndexer = new FileIndexer();
