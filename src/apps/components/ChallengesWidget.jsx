
import { Trophy, TrendingDown, Users } from 'lucide-react';

export default function ChallengesWidget({ space, currentUser, onUpdateSpace }) {
    const challenges = space.data?.challenges || [];

    // Mock functionality to add a default challenge if none exist
    if (challenges.length === 0) {
        // In a real app, this would be done via a creation modal
        const defaultChallenge = {
            id: 1,
            title: 'NO_SPEND_WEEKEND',
            type: 'spending_reduction',
            target: 0,
            participants: space.members.map(m => ({ userId: m.userId, score: Math.floor(Math.random() * 100) }))
        };
        // Side-effect in render is bad, but we are just rendering static data for now unless updated
        // To be safe, we just render a "Create Challenge" placeholder or the mock data virtually
    }

    const handleCreateChallenge = () => {
         const newChallenge = {
            id: Date.now(),
            title: 'SAVINGS_RACE_2077',
            type: 'savings',
            participants: space.members.map(m => ({ userId: m.userId, score: 0 }))
        };

        onUpdateSpace({
            ...space,
            data: {
                ...space.data,
                challenges: [...challenges, newChallenge]
            }
        });
    };

    return (
        <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} className="text-[var(--color-yellow)]" /> ACTIVE_CHALLENGES
                </h3>
                <button
                    onClick={handleCreateChallenge}
                    className="text-[10px] font-bold text-[var(--color-blue)] border border-[var(--color-blue)] px-2 py-1 hover:bg-[var(--color-blue)] hover:text-black transition-colors"
                >
                    + NEW_CHALLENGE
                </button>
            </div>

            <div className="flex-1 space-y-4">
                {challenges.length === 0 ? (
                    <div className="text-center text-gray-600 text-xs py-10">NO_ACTIVE_CHALLENGES</div>
                ) : (
                    challenges.map(challenge => (
                        <div key={challenge.id} className="border border-gray-700 bg-black/40 p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-white text-sm">{challenge.title}</div>
                                <div className="text-[10px] text-gray-400 font-mono uppercase">{challenge.type}</div>
                            </div>

                            <div className="space-y-2 mt-3">
                                {challenge.participants.map((p, i) => {
                                    // Mock user lookup
                                    const userName = `User ${p.userId.substr(0,4)}`;
                                    const isMe = p.userId === currentUser.id;

                                    return (
                                        <div key={p.userId} className="flex items-center gap-2">
                                            <div className="text-[10px] font-mono w-4 text-gray-500">{i + 1}</div>
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${isMe ? 'bg-[var(--color-yellow)]' : 'bg-gray-600'}`}
                                                    style={{ width: `${Math.min(100, p.score)}%` }}
                                                />
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-400">{p.score} pts</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
