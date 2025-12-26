
import { ShoppingCart, Plus, Check, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ShoppingListWidget({ space, currentUser, onUpdateSpace }) {
    const [newItem, setNewItem] = useState('');
    const lists = space.data?.shoppingLists || [];

    // Ensure at least one list exists via side-effect handling, not render mutation
    useEffect(() => {
        if (!space.data?.shoppingLists || space.data.shoppingLists.length === 0) {
            const newList = { id: 1, name: 'General', items: [] };
            onUpdateSpace({
                ...space,
                data: { ...space.data, shoppingLists: [newList] }
            });
        }
    }, [space.data?.shoppingLists]);

    // Fallback while effect runs to prevent crash
    const currentList = lists.length > 0 ? lists[0] : { id: 0, items: [] };

    const handleAddItem = (e) => {
        if (e.key === 'Enter' && newItem.trim()) {
            const updatedLists = lists.map(list => {
                if (list.id === currentList.id) {
                    return {
                        ...list,
                        items: [...list.items, {
                            id: Date.now(),
                            text: newItem,
                            checked: false,
                            addedBy: currentUser.id
                        }]
                    };
                }
                return list;
            });
            onUpdateSpace({ ...space, data: { ...space.data, shoppingLists: updatedLists } });
            setNewItem('');
        }
    };

    const handleToggleItem = (itemId) => {
        const updatedLists = lists.map(list => {
            if (list.id === currentList.id) {
                return {
                    ...list,
                    items: list.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
                };
            }
            return list;
        });
        onUpdateSpace({ ...space, data: { ...space.data, shoppingLists: updatedLists } });
    };

    const handleDeleteItem = (itemId) => {
         const updatedLists = lists.map(list => {
            if (list.id === currentList.id) {
                return {
                    ...list,
                    items: list.items.filter(item => item.id !== itemId)
                };
            }
            return list;
        });
        onUpdateSpace({ ...space, data: { ...space.data, shoppingLists: updatedLists } });
    };

    return (
        <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4 h-full flex flex-col">
            <h3 className="text-[var(--color-yellow)] font-bold text-sm tracking-widest mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
                <ShoppingCart size={14} /> SHARED_SHOPPING_LIST
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4">
                {currentList.items.length === 0 && (
                    <div className="text-gray-600 text-xs italic text-center py-4">LIST_EMPTY</div>
                )}
                {currentList.items.map(item => (
                    <div key={item.id} className="flex items-center gap-2 group">
                        <button
                            onClick={() => handleToggleItem(item.id)}
                            className={`w-4 h-4 border flex items-center justify-center transition-colors ${item.checked ? 'bg-[var(--color-yellow)] border-[var(--color-yellow)]' : 'border-gray-600 hover:border-[var(--color-yellow)]'}`}
                        >
                            {item.checked && <Check size={10} className="text-black" />}
                        </button>
                        <span className={`text-xs text-gray-300 flex-1 ${item.checked ? 'line-through opacity-50' : ''}`}>
                            {item.text}
                        </span>
                        <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-[var(--color-red)] transition-all"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="relative">
                <input
                    className="w-full bg-black border border-gray-700 p-2 pl-8 text-xs text-white outline-none focus:border-[var(--color-blue)]"
                    placeholder="ADD_ITEM..."
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={handleAddItem}
                />
                <Plus size={14} className="absolute left-2 top-2 text-gray-500" />
            </div>
        </div>
    );
}
