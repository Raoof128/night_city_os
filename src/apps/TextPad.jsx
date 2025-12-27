import { useEffect, useState } from 'react';
import { useOS } from '../os/hooks/useOS';
import { Save, FilePlus, Loader } from 'lucide-react';

const TextPadApp = ({ data }) => {
    const { actions } = useOS();
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState(data?.name || 'untitled.txt');
    const [loading, setLoading] = useState(!!data?.fileId);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (data?.fileId) {
                setLoading(true);
                try {
                    const result = await actions.fs.readFile(data.fileId);
                    if (result && result.blob) {
                        const text = await result.blob.text();
                        setContent(text);
                        setDirty(false);
                    }
                } catch (e) {
                    console.error('Failed to read file', e);
                    setContent('// ERROR: FAILED TO READ DATA SHARD');
                }
                setLoading(false);
            } else {
                setContent('// NEW BUFFER\n');
            }
        };
        load();
    }, [data?.fileId, actions.fs]);

    const handleSave = async () => {
        if (data?.fileId) {
            await actions.fs.updateFile(data.fileId, content);
            setDirty(false);
            actions.addNotification({ title: 'Saved', message: fileName, type: 'success' });
                } else {
                    // New file creation - simpler to just prompt here or assume root? 
                    // For now, let's just create in root if no context
                    await actions.fs.createFile('root', fileName, content);
                    actions.addNotification({ title: 'Created', message: fileName, type: 'success' });
                    setDirty(false);
                    // Ideally we'd redirect to this fileId, but for now just saved
                }    };

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
                        {data?.fileId ? <Save size={12} /> : <FilePlus size={12} />} SAVE
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