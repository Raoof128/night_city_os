import { useState, useEffect, useRef } from 'react';
import { useApp } from '../os/kernel/AppContext';
import { Loader, AlertTriangle } from 'lucide-react';

const MediaViewer = () => {
    const { fs, launchArgs } = useApp();
    const [url, setUrl] = useState(null);
    const [type, setType] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const urlRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            if (!launchArgs?.fileId) {
                setError('No file loaded.');
                setLoading(false);
                return;
            }

            try {
                const { blob, meta } = await fs.readFile(launchArgs.fileId);
                const objUrl = URL.createObjectURL(blob);
                urlRef.current = objUrl;
                setUrl(objUrl);
                
                // Determine type based on mime or extension
                if (meta.mime.startsWith('image/')) setType('image');
                else if (meta.mime.startsWith('video/')) setType('video');
                else if (meta.name.endsWith('.png') || meta.name.endsWith('.jpg')) setType('image');
                else setType('unknown');

                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };
        load();

        return () => {
            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
                urlRef.current = null;
            }
        };
    }, [launchArgs?.fileId, fs]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-black">
                <Loader className="text-[var(--color-blue)] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-black text-[var(--color-red)] gap-2">
                <AlertTriangle />
                <span className="font-mono text-sm">{error}</span>
            </div>
        );
    }

    return (
        <div className="h-full bg-black flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/os_background.jpg')] bg-cover opacity-10 blur-xl pointer-events-none" />
            
            {type === 'image' && (
                <img src={url} alt="Media" className="max-w-full max-h-full object-contain shadow-2xl" />
            )}
            
            {type === 'video' && (
                <video src={url} controls className="max-w-full max-h-full" />
            )}

            {type === 'unknown' && (
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">?</div>
                    <div>UNKNOWN_FORMAT</div>
                </div>
            )}
        </div>
    );
};

export default MediaViewer;
