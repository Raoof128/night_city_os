import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ScanLine } from 'lucide-react';
import DraggableItem from './DraggableItem';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; // Runtime injected via .env

const DesktopUploadWidget = ({ onTransactionUpdate, onFileUpload, constraintsRef }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('IDLE');

    const processFile = async (file) => {
        if (!file) return;
        setStatus('ANALYZING');
        try {
            // Check if it's an image or audio for scanning
            if (file.type.startsWith('image/') || file.type.startsWith('audio/')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const base64Data = reader.result.split(',')[1];
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

                    const isAudio = file.type.startsWith('audio/');
                    const prompt = isAudio
                        ? "Listen to this voice note about expenses. Extract the TOTAL amount, MERCHANT/CONTEXT, and CATEGORY. Return ONLY a valid JSON object with keys: 'amount' (number), 'summary' (string, max 20 chars), 'category' (string)."
                        : "Analyze this image (receipt/statement). Extract the TOTAL amount, MERCHANT, and CATEGORY (Food, Transport, Tech, Utilities, Entertainment, Health, Other). Return ONLY a valid JSON object with keys: 'amount' (number), 'summary' (string, max 20 chars), 'category' (string).";

                    const payload = { contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: file.type, data: base64Data } }] }], generationConfig: { responseMimeType: "application/json" } };

                    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    const result = await response.json();
                    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (text) {
                        const data = JSON.parse(text);
                        onTransactionUpdate(data);
                        setStatus('SUCCESS');
                        setTimeout(() => setStatus('IDLE'), 2000);
                    } else { throw new Error("No data returned from AI"); }
                };
            } else {
                // If it's not an image (or if AI fails), treat as generic file upload
                onFileUpload(file);
                setStatus('SUCCESS');
                setTimeout(() => setStatus('IDLE'), 2000);
            }
        } catch (e) {
            console.error(e);
            // Fallback to generic file upload on error
            onFileUpload(file);
            setStatus('SUCCESS'); // Technically a "success" as a file, even if AI failed
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <DraggableItem initialX="auto" initialY="40px" className="right-10 w-64" constraintsRef={constraintsRef}>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
                className={`relative p-6 border-2 transition-all duration-200 group min-h-[140px] flex flex-col items-center justify-center rounded-lg backdrop-blur-sm ${isDragging ? 'bg-[var(--color-yellow)]/20 border-[var(--color-yellow)]' : 'bg-black/60 border-gray-700 hover:border-[var(--color-blue)]'}`}
            >
                <div className="absolute top-0 left-0 w-2 h-2 bg-white -translate-x-1 -translate-y-1 opacity-50" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-white translate-x-1 -translate-y-1 opacity-50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-white -translate-x-1 translate-y-1 opacity-50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-white translate-x-1 translate-y-1 opacity-50" />

                {status === 'ANALYZING' && (
                    <div className="text-center w-full">
                        <ScanLine size={32} className="mx-auto mb-2 text-[var(--color-blue)] animate-bounce" />
                        <div className="text-xs font-black text-[var(--color-blue)] animate-pulse">NEURAL_SCANNING...</div>
                        <div className="w-full h-1 bg-gray-800 mt-2 overflow-hidden rounded-full"><motion.div className="h-full bg-[var(--color-yellow)]" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} /></div>
                    </div>
                )}
                {status === 'SUCCESS' && <div className="text-center"><div className="text-[var(--color-blue)] font-bold text-sm">UPLOAD_COMPLETE</div></div>}
                {status === 'ERROR' && <div className="text-center"><div className="text-[var(--color-red)] font-bold text-sm">SCAN_FAILED</div></div>}
                {status === 'IDLE' && (
                    <div className="text-center group-hover:scale-105 transition-transform pointer-events-none">
                        <UploadCloud size={32} className="mx-auto mb-2 text-gray-500 group-hover:text-[var(--color-blue)]" />
                        <div className="font-bold text-sm text-gray-300">DROP_RECEIPT_OR_SHARD</div>
                    </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
            </div>
        </DraggableItem>
    );
};

export default DesktopUploadWidget;
