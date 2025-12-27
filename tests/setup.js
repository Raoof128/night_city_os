import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import 'fake-indexeddb/auto'; // Mock IDB globally

// Extend Vitest assertions
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock Storage API if needed (though happy-dom covers basic localStorage)
if (!global.localStorage) {
    global.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
    };
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock Navigator Storage (OPFS)
if (!global.navigator.storage) {
    const createDirMock = () => ({
        getDirectoryHandle: async () => createDirMock(),
        getFileHandle: async () => ({
            createWritable: async () => ({
                write: async () => {},
                close: async () => {}
            }),
            getFile: async () => new Blob([''], { type: 'text/plain' })
        }),
        removeEntry: async () => {}
    });

    global.navigator.storage = {
        getDirectory: async () => createDirMock()
    };
}