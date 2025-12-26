
export const ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer'
};

export const ACTIONS = {
    VIEW: 'view',
    EDIT_DATA: 'edit_data',
    MANAGE_MEMBERS: 'manage_members',
    APPROVE_TRANSACTIONS: 'approve_transactions'
};

export const createMember = (userId, role = ROLES.VIEWER) => ({
    userId,
    role,
    joinedAt: new Date().toISOString()
});

export const createSpace = (name, type, creatorId) => ({
    id: `space_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type, // 'personal', 'family', 'roommates'
    createdAt: new Date().toISOString(),
    members: [createMember(creatorId, ROLES.ADMIN)],
    data: {
        balance: 0,
        currency: 'EDDIES',
        spent: 0,
        recent: [],
        assets: [],
        subscriptions: [],
        goals: [],
        shoppingLists: [],
        challenges: []
    },
    settings: {
        approvalThreshold: 1000,
        allowanceEnabled: false
    }
});

export const migrateDataToSpace = (oldData, creatorId) => {
    const space = createSpace('Personal Space', 'personal', creatorId);
    space.data = { ...space.data, ...oldData };
    return space;
};

export const checkPermission = (space, userId, action) => {
    if (!space || !userId) return false;

    const member = space.members.find(m => m.userId === userId);
    if (!member) return false;

    if (member.role === ROLES.ADMIN) return true;

    switch (action) {
        case ACTIONS.VIEW:
            return true; // Everyone can view if they are a member
        case ACTIONS.EDIT_DATA:
            return member.role === ROLES.EDITOR;
        case ACTIONS.APPROVE_TRANSACTIONS:
            return false; // Only admin for now (or specific parent role later)
        case ACTIONS.MANAGE_MEMBERS:
            return false;
        default:
            return false;
    }
};

export const MOCK_USERS = [
    { id: 'user_1', name: 'Raouf (Admin)', avatar: null },
    { id: 'user_2', name: 'Partner (Editor)', avatar: null },
    { id: 'user_3', name: 'Kid (Viewer)', avatar: null },
    { id: 'user_4', name: 'Roommate (Editor)', avatar: null }
];
