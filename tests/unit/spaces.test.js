
import { describe, it, expect } from 'vitest';
import {
    createSpace,
    createMember,
    checkPermission,
    migrateDataToSpace,
    ROLES,
    ACTIONS
} from '../../src/utils/spaces';

const MOCK_USER_ID = 'user_1';

describe('Spaces Logic', () => {
    it('creates a space with default admin member', () => {
        const space = createSpace('Test Family', 'family', MOCK_USER_ID);
        expect(space.name).toBe('Test Family');
        expect(space.type).toBe('family');
        expect(space.members).toHaveLength(1);
        expect(space.members[0].userId).toBe(MOCK_USER_ID);
        expect(space.members[0].role).toBe(ROLES.ADMIN);
    });

    it('adds a member correctly', () => {
        const member = createMember('user_2', ROLES.EDITOR);
        expect(member.userId).toBe('user_2');
        expect(member.role).toBe(ROLES.EDITOR);
    });

    it('migrates legacy data correctly', () => {
        const oldData = { balance: 100, recent: [] };
        const space = migrateDataToSpace(oldData, MOCK_USER_ID);
        expect(space.data.balance).toBe(100);
        expect(space.members[0].userId).toBe(MOCK_USER_ID);
    });

    describe('Permissions', () => {
        const admin = { userId: 'admin', role: ROLES.ADMIN };
        const editor = { userId: 'editor', role: ROLES.EDITOR };
        const viewer = { userId: 'viewer', role: ROLES.VIEWER };

        const space = {
            id: 's1',
            members: [admin, editor, viewer]
        };

        it('allows admin to do everything', () => {
            expect(checkPermission(space, 'admin', ACTIONS.MANAGE_MEMBERS)).toBe(true);
            expect(checkPermission(space, 'admin', ACTIONS.EDIT_DATA)).toBe(true);
        });

        it('allows editor to edit data but not manage members', () => {
            expect(checkPermission(space, 'editor', ACTIONS.EDIT_DATA)).toBe(true);
            expect(checkPermission(space, 'editor', ACTIONS.MANAGE_MEMBERS)).toBe(false);
        });

        it('allows viewer to only view', () => {
            expect(checkPermission(space, 'viewer', ACTIONS.VIEW)).toBe(true);
            expect(checkPermission(space, 'viewer', ACTIONS.EDIT_DATA)).toBe(false);
        });

        it('denies unknown user', () => {
            expect(checkPermission(space, 'stranger', ACTIONS.VIEW)).toBe(false);
        });
    });
});
