
import { motion } from 'framer-motion';
import { X, UserPlus, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';
import { ROLES, createMember, checkPermission, ACTIONS, MOCK_USERS } from '../../utils/spaces';

export default function SpaceSettingsModal({ space, currentUser, onUpdateSpace, onClose }) {
    const [activeTab, setActiveTab] = useState('members');
    const [inviteEmail, setInviteEmail] = useState('');

    const canManageMembers = checkPermission(space, currentUser.id, ACTIONS.MANAGE_MEMBERS);

    const handleAddMember = () => {
        // In a real app, this would invite via email.
        // Here we just pick a random mock user that isn't already in the space.
        const existingIds = space.members.map(m => m.userId);
        const availableUser = MOCK_USERS.find(u => !existingIds.includes(u.id));

        if (availableUser) {
            const newMember = createMember(availableUser.id, ROLES.VIEWER);
            const updatedSpace = {
                ...space,
                members: [...space.members, newMember]
            };
            onUpdateSpace(updatedSpace);
            alert(`Added ${availableUser.name} to space.`);
        } else {
            alert('All mock users are already in this space.');
        }
    };

    const handleUpdateRole = (userId, newRole) => {
        if (!canManageMembers) return;
        const updatedSpace = {
            ...space,
            members: space.members.map(m => m.userId === userId ? { ...m, role: newRole } : m)
        };
        onUpdateSpace(updatedSpace);
    };

    const handleRemoveMember = (userId) => {
        if (!canManageMembers || userId === currentUser.id) return;
        if (confirm('Are you sure?')) {
            const updatedSpace = {
                ...space,
                members: space.members.filter(m => m.userId !== userId)
            };
            onUpdateSpace(updatedSpace);
        }
    };

    const handleUpdateSettings = (key, value) => {
        // Only admin can change settings
        if (!canManageMembers) return;
        const updatedSpace = {
            ...space,
            settings: { ...space.settings, [key]: value }
        };
        onUpdateSpace(updatedSpace);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black border border-[var(--color-yellow)] w-full max-w-lg shadow-[0_0_30px_rgba(255,224,0,0.1)] flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[var(--color-surface)]/20">
                    <h2 className="text-[var(--color-yellow)] text-lg font-black tracking-widest flex items-center gap-2">
                        <Settings size={18} /> SPACE_CONFIG // {space.name.toUpperCase()}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`flex-1 py-3 text-xs font-bold ${activeTab === 'members' ? 'bg-[var(--color-yellow)] text-black' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        MEMBERS_AND_ROLES
                    </button>
                    <button
                        onClick={() => setActiveTab('policies')}
                        className={`flex-1 py-3 text-xs font-bold ${activeTab === 'policies' ? 'bg-[var(--color-yellow)] text-black' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        POLICIES_AND_LIMITS
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {activeTab === 'members' && (
                        <div className="space-y-4">
                            {canManageMembers && (
                                <div className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        placeholder="NET_ID_OR_EMAIL"
                                        className="flex-1 bg-black border border-gray-700 p-2 text-xs text-white outline-none focus:border-[var(--color-yellow)]"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                    <button
                                        onClick={handleAddMember}
                                        className="bg-[var(--color-yellow)] text-black px-4 py-2 text-xs font-bold hover:bg-white transition-colors flex items-center gap-2"
                                    >
                                        <UserPlus size={14} /> ADD
                                    </button>
                                </div>
                            )}

                            <div className="space-y-2">
                                {space.members.map(member => {
                                    const user = MOCK_USERS.find(u => u.id === member.userId) || { name: 'Unknown', id: member.userId };
                                    const isMe = member.userId === currentUser.id;

                                    return (
                                        <div key={member.userId} className="flex items-center justify-between p-3 border border-gray-800 bg-[var(--color-surface)]/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-500">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        {user.name}
                                                        {isMe && <span className="text-[9px] bg-[var(--color-blue)] text-black px-1 rounded">YOU</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono">{member.userId}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <select
                                                    disabled={!canManageMembers || isMe}
                                                    value={member.role}
                                                    onChange={(e) => handleUpdateRole(member.userId, e.target.value)}
                                                    className="bg-black border border-gray-700 text-xs p-1 text-[var(--color-yellow)] outline-none disabled:opacity-50"
                                                >
                                                    <option value={ROLES.ADMIN}>ADMIN</option>
                                                    <option value={ROLES.EDITOR}>EDITOR</option>
                                                    <option value={ROLES.VIEWER}>VIEWER</option>
                                                </select>

                                                {canManageMembers && !isMe && (
                                                    <button onClick={() => handleRemoveMember(member.userId)} className="text-gray-600 hover:text-[var(--color-red)]">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'policies' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400">TRANSACTION APPROVAL THRESHOLD</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        disabled={!canManageMembers}
                                        value={space.settings?.approvalThreshold || 1000}
                                        onChange={(e) => handleUpdateSettings('approvalThreshold', parseInt(e.target.value))}
                                        className="bg-black border border-gray-700 p-2 text-white text-sm outline-none w-32 focus:border-[var(--color-yellow)]"
                                    />
                                    <span className="text-xs text-gray-500">Transactions above this amount require Admin approval.</span>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-gray-800 pt-4">
                                <label className="text-xs font-bold text-gray-400">TEEN MODE / ALLOWANCE</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        disabled={!canManageMembers}
                                        checked={space.settings?.allowanceEnabled || false}
                                        onChange={(e) => handleUpdateSettings('allowanceEnabled', e.target.checked)}
                                        className="accent-[var(--color-yellow)]"
                                    />
                                    <span className="text-sm text-white">Enable Allowance & Spending Limits</span>
                                </div>
                                {space.settings?.allowanceEnabled && (
                                    <div className="ml-6 mt-2 p-3 bg-red-900/10 border border-red-900/30">
                                        <p className="text-xs text-[var(--color-red)] mb-2">RESTRICTIONS ACTIVE</p>
                                        <p className="text-[10px] text-gray-400">Members with &apos;VIEWER&apos; role will be treated as dependent accounts with spending limits.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
