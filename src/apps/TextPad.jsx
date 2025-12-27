import { useEffect, useState, useRef } from 'react';
import { useApp } from '../os/kernel/AppContext';
import { Save, FilePlus, Loader } from 'lucide-react';

const TextPadApp = () => {
    const { fs, addNotification, launchArgs } = useApp();
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState(launchArgs?.name || 'untitled.txt');
    const [fileId, setFileId] = useState(launchArgs?.fileId || null);
    const [loading, setLoading] = useState(!!launchArgs?.fileId);
    const [dirty, setDirty] = useState(false);
    
    // Autosave ref to prevent stale closures
    const contentRef = useRef(content);
    contentRef.current = content;

    useEffect(() => {
        const load = async () => {
            if (launchArgs?.fileId) {
                setLoading(true);
                try {
                    const result = await fs.readFile(launchArgs.fileId);
                    if (result && result.blob) {
                        const text = await result.blob.text();
                        setContent(text);
                        setDirty(false);
                    }
                } catch (e) {
                    setContent('// ERROR: FAILED TO READ DATA SHARD');
                }
                setLoading(false);
            } else {
                setContent('// NEW BUFFER\n');
            }
        };
        load();
    }, [launchArgs?.fileId, fs]);

    // Autosave
    useEffect(() => {
        if (!fileId || !dirty) return;

        const timer = setTimeout(async () => {
            try {
                await fs.updateFile(fileId, contentRef.current);
                setDirty(false);
                // Optional: Silent toast or indicator
            } catch (e) {
                console.error('Autosave failed', e);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [content, fileId, dirty, fs]);

    const handleSave = async () => {
        try {
            if (fileId) {
                await fs.updateFile(fileId, content);
                setDirty(false);
                addNotification({ title: 'Saved', message: fileName, type: 'success' });
            } else {
                // Create in root by default if new
                const node = await fs.createFile('root', fileName, content);
                setFileId(node.id); // Update context
                setDirty(false);
                addNotification({ title: 'Created', message: fileName, type: 'success' });
            }
        } catch (e) {
            addNotification({ title: 'Save Failed', message: e.message, type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-black text-[var(--color-blue)]">
                <Loader className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-black">
            <div className="bg-[var(--color-surface)] px-2 py-1 text-xs text-gray-500 font-mono flex items-center gap-2">
                <span className="text-[var(--color-blue)] truncate max-w-[120px]">{fileName}</span>
                {dirty ? <span className="text-[var(--color-yellow)]">• UNSAVED</span> : <span className="text-[var(--color-blue)]">SAVED</span>}
                <div className="ml-auto flex gap-2">
                    <input
                        className="bg-black text-[var(--color-yellow)] border border-gray-800 px-2 py-1 text-xs"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1 px-2 py-1 border border-[var(--color-blue)] text-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-black"
                    >
                        {fileId ? <Save size={12} /> : <FilePlus size={12} />} SAVE
                    </button>
                </div>
            </div>
            <textarea
                className="flex-1 bg-transparent text-[var(--color-blue)] font-mono p-4 outline-none resize-none selection:bg-[var(--color-yellow)] selection:text-black"
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                    setDirty(true);
                }}
                spellCheck="false"
            />
        </div>
    );
};

export default TextPadApp;
