import { useState } from 'react';
import { useOS } from '../os/hooks/useOS';
import { resolveFileHandler } from '../os/kernel/registry';
import { 
    Folder, File, HardDrive, ChevronRight, ChevronDown, 
    Grid, List, ArrowLeft, Plus, Trash2, Search 
} from 'lucide-react';

const FileIcon = ({ type }) => {
    if (type === 'folder') return <Folder size={20} className="text-[var(--color-yellow)]" />;
    if (type === 'mount') return <HardDrive size={20} className="text-[var(--color-red)]" />;
    return <File size={20} className="text-[var(--color-blue)]" />;
};

const TreeNode = ({ node, nodes, expanded, onToggle, onSelect, currentPath }) => {
    const isExpanded = expanded.includes(node.id);
    const hasChildren = Object.values(nodes).some(n => n.parentId === node.id && n.type !== 'file');
    const isSelected = currentPath === node.id;

    return (
        <div className="select-none">
            <div 
                className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-white/5 ${isSelected ? 'bg-white/10 text-[var(--color-yellow)]' : 'text-gray-400'}`}
                onClick={() => {
                    onSelect(node.id);
                    if (hasChildren) onToggle(node.id);
                }}
            >
                <div className="w-4 flex justify-center">
                    {hasChildren && (
                        <div onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}>
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </div>
                    )}
                </div>
                <FileIcon type={node.type} />
                <span className="text-xs truncate">{node.name}</span>
            </div>
            {isExpanded && (
                <div className="pl-4 border-l border-white/5 ml-2">
                    {Object.values(nodes)
                        .filter(n => n.parentId === node.id && n.type !== 'file')
                        .map(child => (
                            <TreeNode 
                                key={child.id} 
                                node={child} 
                                nodes={nodes} 
                                expanded={expanded} 
                                onToggle={onToggle}
                                onSelect={onSelect}
                                currentPath={currentPath}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

const FileExplorer = () => {
    const { state, actions } = useOS();
    const { fs } = state;
    const { nodes } = fs;
    
    const [currentPath, setCurrentPath] = useState('root');
    const [viewMode, setViewMode] = useState('grid');
    const [expandedFolders, setExpandedFolders] = useState(['root']);
    const [searchQuery, setSearchQuery] = useState('');

    const items = Object.values(nodes).filter(n => n.parentId === currentPath);
    
    const filteredItems = items.filter(item =>  
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNavigate = (id) => {
        setCurrentPath(id);
        if (!expandedFolders.includes(id)) {
            setExpandedFolders(prev => [...prev, id]);
        }
    };

    const handleToggleExpand = (id) => {
        setExpandedFolders(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleOpenFile = async (node) => {
        if (node.type === 'folder' || node.type === 'mount') {
            handleNavigate(node.id);
        } else {
            // Resolve Handler
            const handlerId = resolveFileHandler(node.name, node.mime);
            
            if (handlerId) {
                actions.openWindow(handlerId, handlerId, { fileId: node.id, name: node.name });
            } else {
                actions.addNotification({ 
                    title: 'Cannot Open', 
                    message: `No handler for ${node.name}`, 
                    type: 'warning' 
                });
            }
        }
    };

    const handleCreateFolder = async () => {
        const name = prompt('Folder Name:', 'New Folder');
        if (name) {
            await actions.fs.createFolder(currentPath, name);
        }
    };

    const handleCreateFile = async () => {
        const name = prompt('File Name:', 'new_file.txt');
        if (name) {
            await actions.fs.createFile(currentPath, name, '');
        }
    };

    return (
        <div className="flex h-full text-gray-200 bg-[#0a0a0a]">
            {/* Sidebar */}
            <div className="w-48 border-r border-white/10 flex flex-col bg-black/20">
                <div className="p-3 border-b border-white/10 font-bold text-xs tracking-widest text-[var(--color-blue)]">
                    NIGHT_CITY // FS
                </div>
                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                    {nodes['root'] && (
                        <TreeNode 
                            node={nodes['root']} 
                            nodes={nodes} 
                            expanded={expandedFolders} 
                            onToggle={handleToggleExpand}
                            onSelect={handleNavigate}
                            currentPath={currentPath}
                        />
                    )}
                </div>
                {/* Mount Button */}
                <div className="p-2 border-t border-white/10">
                    <button 
                        onClick={() => actions.fs.mountDrive()}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold transition-colors"
                    >
                        <HardDrive size={14} /> MOUNT_DRIVE
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={!nodes[currentPath]?.parentId}
                            onClick={() => setCurrentPath(nodes[currentPath].parentId)}
                            className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div className="text-sm font-mono text-gray-400">
                            {nodes[currentPath]?.name || 'root'}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="SEARCH..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-full pl-8 pr-3 py-1 text-xs w-40 focus:w-60 focus:border-[var(--color-yellow)] transition-all outline-none"
                            />
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <button onClick={() => setViewMode('grid')} aria-label="Grid View" className={`p-1.5 rounded ${viewMode === 'grid' ? 'text-[var(--color-yellow)]' : 'text-gray-500'}`}>
                            <Grid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} aria-label="List View" className={`p-1.5 rounded ${viewMode === 'list' ? 'text-[var(--color-yellow)]' : 'text-gray-500'}`}>
                            <List size={16} />
                        </button>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <button onClick={handleCreateFile} aria-label="New File" className="p-1.5 hover:bg-white/10 rounded text-[var(--color-blue)]" title="New File">
                            <Plus size={16} />
                        </button>
                        <button onClick={handleCreateFolder} aria-label="New Folder" className="p-1.5 hover:bg-white/10 rounded text-[var(--color-yellow)]" title="New Folder">
                            <Folder size={16} />
                        </button>
                    </div>
                </div>

                {/* File Area */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {filteredItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600">
                            <div className="text-4xl font-mono mb-2 opacity-20">EMPTY_SECTOR</div>
                            <div className="text-xs tracking-widest">NO DATA FOUND</div>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-4 md:grid-cols-6 gap-4' : 'flex flex-col gap-1'}>
                            {filteredItems.map(item => (
                                <div 
                                    key={item.id}
                                    onDoubleClick={() => handleOpenFile(item)}
                                    className={`group relative ${viewMode === 'grid' 
                                        ? 'flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-lg cursor-pointer border border-transparent hover:border-white/10 transition-all'
                                        : 'flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer border-b border-white/5'
                                    }`}
                                >
                                    <FileIcon type={item.type} mime={item.mime} />
                                    
                                    <div className={`min-w-0 ${viewMode === 'grid' ? 'text-center' : 'flex-1 flex justify-between'}`}>
                                        <span className="text-xs font-bold text-gray-300 truncate block max-w-full">
                                            {item.name}
                                        </span>
                                        {viewMode === 'list' && (
                                            <span className="text-[10px] text-gray-600 font-mono">
                                                {new Date(item.modified).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Context Actions (Hover) */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`Delete ${item.name}?`)) {
                                                actions.fs.deleteNode(item.id);
                                            }
                                        }}
                                        aria-label={`Delete ${item.name}`}
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileExplorer;
