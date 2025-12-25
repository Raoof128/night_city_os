import React, { useState } from 'react';

const TextPadApp = () => {
    const [text, setText] = useState("// NOTES_BUFFER_V1\n// ENCRYPTED: YES\n\n- Buy more RAM for the cyberdeck.\n- Meeting with Fixer at 10 PM.\n");

    return (
        <div className="h-full flex flex-col bg-black">
            <div className="bg-[var(--color-surface)] px-2 py-1 text-xs text-gray-500 font-mono flex gap-2">
                <span>UTF-8</span>
                <span>RO-RW</span>
                <span className="text-[var(--color-blue)]">SAVED</span>
            </div>
            <textarea
                className="flex-1 bg-transparent text-[var(--color-blue)] font-mono p-4 outline-none resize-none selection:bg-[var(--color-yellow)] selection:text-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck="false"
            />
        </div>
    );
};

export default TextPadApp;
