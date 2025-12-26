import { useEffect, useMemo, useState } from 'react';
import { Save, FilePlus } from 'lucide-react';

const TextPadApp = ({ activeFile, onSaveFile, onCreateFile }) => {
    const seed = "// NOTES_BUFFER_V1\n// ENCRYPTED: YES\n\n- Buy more RAM for the cyberdeck.\n- Meeting with Fixer at 10 PM.\n";
    const [draft, setDraft] = useState(activeFile?.content || seed);
    const [fileName, setFileName] = useState(activeFile?.name || 'untitled.txt');

    useEffect(() => {
        setDraft(activeFile?.content ?? seed);
        setFileName(activeFile?.name ?? 'untitled.txt');
    }, [activeFile]);

    const isDirty = useMemo(() => draft !== (activeFile?.content ?? seed), [draft, activeFile, seed]);

    const handleSave = () => {
        if (activeFile?.id) {
            onSaveFile && onSaveFile(activeFile.id, draft);
        } else {
            onCreateFile && onCreateFile(fileName || 'untitled.txt', draft);
        }
    };

    return (
        <div className="h-full flex flex-col bg-black">
            <div className="bg-[var(--color-surface)] px-2 py-1 text-xs text-gray-500 font-mono flex items-center gap-2">
                <span className="text-[var(--color-blue)] truncate max-w-[120px]">{fileName}</span>
                {isDirty ? <span className="text-[var(--color-yellow)]">• UNSAVED</span> : <span className="text-[var(--color-blue)]">SAVED</span>}
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
                        {activeFile ? <Save size={12} /> : <FilePlus size={12} />} SAVE
                    </button>
                </div>
            </div>
            <textarea
                className="flex-1 bg-transparent text-[var(--color-blue)] font-mono p-4 outline-none resize-none selection:bg-[var(--color-yellow)] selection:text-black"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck="false"
            />
        </div>
    );
};

export default TextPadApp;
