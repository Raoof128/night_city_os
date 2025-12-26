import { nanoid } from 'nanoid';

export const createFile = ({ name, mime = 'text/plain', content = '' }) => ({
    id: nanoid(),
    name,
    type: 'file',
    mime,
    content,
    children: []
});

export const createFolder = ({ name }) => ({
    id: nanoid(),
    name,
    type: 'folder',
    children: []
});

export const ensureRoot = (vfs) => {
    if (vfs && vfs.id) return vfs;
    return createFolder({ name: 'root' });
};

const deepClone = (node) => JSON.parse(JSON.stringify(node));

export const findNode = (node, id) => {
    if (!node) return null;
    if (node.id === id) return node;
    if (!node.children) return null;
    for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
    }
    return null;
};

export const addNode = (root, parentId, newNode) => {
    const cloned = deepClone(root);
    const target = findNode(cloned, parentId) || cloned;
    if (!target.children) target.children = [];
    target.children.push(newNode);
    return cloned;
};

export const deleteNode = (root, id) => {
    if (!root || root.id === id) return ensureRoot();
    const cloned = deepClone(root);
    const walk = (node) => {
        node.children = (node.children || []).filter(child => child.id !== id);
        node.children.forEach(walk);
    };
    walk(cloned);
    return cloned;
};

export const renameNode = (root, id, name) => {
    const cloned = deepClone(root);
    const target = findNode(cloned, id);
    if (target) target.name = name;
    return cloned;
};

export const updateFileContent = (root, id, content) => {
    const cloned = deepClone(root);
    const target = findNode(cloned, id);
    if (target && target.type === 'file') {
        target.content = content;
    }
    return cloned;
};
