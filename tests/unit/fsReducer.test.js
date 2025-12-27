import { describe, it, expect } from 'vitest';
import { osReducer, ACTIONS, INITIAL_STATE } from '../../src/os/store/osReducer';

describe('File System Reducer Logic', () => {
    
    it('should set initial nodes', () => {
        const nodes = {
            'root': { id: 'root', type: 'folder' },
            'file1': { id: 'file1', type: 'file', parentId: 'root' }
        };
        const action = { type: ACTIONS.FS_SET_NODES, payload: nodes };
        const state = osReducer(INITIAL_STATE, action);
        
        expect(state.fs.nodes).toEqual(nodes);
    });

    it('should update a node', () => {
        const initialState = {
            ...INITIAL_STATE,
            fs: {
                nodes: {
                    'file1': { id: 'file1', name: 'old.txt' }
                }
            }
        };
        const updatedNode = { id: 'file1', name: 'new.txt' };
        const action = { type: ACTIONS.FS_UPDATE_NODE, payload: updatedNode };
        const state = osReducer(initialState, action);
        
        expect(state.fs.nodes['file1'].name).toBe('new.txt');
    });

    it('should delete a node', () => {
        const initialState = {
            ...INITIAL_STATE,
            fs: {
                nodes: {
                    'file1': { id: 'file1' },
                    'file2': { id: 'file2' }
                }
            }
        };
        const action = { type: ACTIONS.FS_DELETE_NODE, payload: { id: 'file1' } };
        const state = osReducer(initialState, action);
        
        expect(state.fs.nodes['file1']).toBeUndefined();
        expect(state.fs.nodes['file2']).toBeDefined();
    });
});
