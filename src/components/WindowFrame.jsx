import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Maximize2, X } from 'lucide-react';
import { COLORS } from '../utils/theme';

const RESIZE_HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
const SNAP_THRESHOLD = 20;

const WindowFrame = ({
    item,
    children,
    isActive,
    onFocus,
    onClose,
    onMinimize,
    onMaximize,
    onMove,
    onResize,
    onSnap,
    zIndex
}) => {
    const { id, title, minimized, maximized, pos, size } = item;

    // Local state for smooth dragging/resizing
    const [localPos, setLocalPos] = useState(pos || { x: 100, y: 100 });
    const [localSize, setLocalSize] = useState(size || { w: 800, h: 600 });
    const [isDragging, setIsDragging] = useState(false);
    const [snapPreview, setSnapPreview] = useState(null); // { x, y, w, h }

    useEffect(() => {
        if (!isDragging) {
            if (pos) setLocalPos(pos);
            if (size) setLocalSize(size);
        }
    }, [pos, size, isDragging]);

    if (minimized) return null;

    const handleResizeStart = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        onFocus();

        const startX = e.clientX;
        const startY = e.clientY;
        const startW = localSize.w;
        const startH = localSize.h;
        const startPosX = localPos.x;
        const startPosY = localPos.y;

        let currentSize = { w: startW, h: startH };
        let currentPos = { x: startPosX, y: startPosY };

        const safeMouseMove = (ev) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            let newW = startW, newH = startH, newX = startPosX, newY = startPosY;

            if (direction.includes('e')) newW = Math.max(300, startW + dx);
            if (direction.includes('s')) newH = Math.max(200, startH + dy);

            if (direction.includes('w')) {
                const w = Math.max(300, startW - dx);
                newX = startPosX + (startW - w);
                newW = w;
            }
            if (direction.includes('n')) {
                const h = Math.max(200, startH - dy);
                newY = startPosY + (startH - h);
                newH = h;
            }

            currentSize = { w: newW, h: newH };
            currentPos = { x: newX, y: newY };
            setLocalSize(currentSize);
            setLocalPos(currentPos);
        };

        const safeMouseUp = () => {
            document.removeEventListener('mousemove', safeMouseMove);
            document.removeEventListener('mouseup', safeMouseUp);
            onResize(id, currentSize);
            onMove(id, currentPos);
        };

        document.addEventListener('mousemove', safeMouseMove);
        document.addEventListener('mouseup', safeMouseUp);
    };

    return (
        <>
            {/* Snap Preview Overlay */}
            <AnimatePresence>
                {snapPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed bg-[var(--color-yellow)]/20 border-2 border-[var(--color-yellow)] z-[9999] pointer-events-none rounded-lg backdrop-blur-sm"
                        style={{
                            left: snapPreview.x,
                            top: snapPreview.y,
                            width: snapPreview.w,
                            height: snapPreview.h
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{
                    x: maximized ? 0 : localPos.x,
                    y: maximized ? 0 : localPos.y,
                    width: maximized ? '100vw' : localSize.w,
                    height: maximized ? '100vh' : localSize.h,
                    opacity: 1,
                    scale: 1,
                    zIndex
                }}
                transition={{ duration: 0.1 }}
                onMouseDown={onFocus}
                className="absolute rounded-lg flex flex-col backdrop-blur-md overflow-hidden"
                style={{
                    position: 'fixed',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: `1px solid ${isActive ? COLORS.YELLOW : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: isActive ? `0 0 30px rgba(0,0,0,0.5), 0 0 0 1px ${COLORS.YELLOW}` : '0 10px 40px rgba(0,0,0,0.5)',
                }}
            >
                <div
                    className={`h-10 flex items-center justify-between px-3 select-none ${maximized ? '' : 'cursor-grab active:cursor-grabbing'}`}
                    style={{ backgroundColor: isActive ? 'rgba(255, 224, 0, 0.9)' : 'rgba(20, 20, 20, 0.9)' }}
                    onPointerDown={(e) => {
                        if (maximized) return;
                        e.preventDefault();
                        setIsDragging(true);
                        onFocus();

                        const startX = e.clientX - localPos.x;
                        const startY = e.clientY - localPos.y;

                        let finalPos = { x: localPos.x, y: localPos.y };
                        let currentSnap = null;

                        const wrapperMove = (ev) => {
                            const newX = ev.clientX - startX;
                            const newY = ev.clientY - startY;
                            const clampedY = Math.max(0, Math.min(window.innerHeight - 40, newY));
                            finalPos = { x: newX, y: clampedY };
                            setLocalPos(finalPos);

                            // Snap Detection
                            const mouseX = ev.clientX;
                            const mouseY = ev.clientY;
                            const vw = window.innerWidth;
                            const vh = window.innerHeight;
                            const taskbarH = 48;

                            currentSnap = null;
                            let preview = null;

                            if (mouseX < SNAP_THRESHOLD) {
                                // Left
                                if (mouseY < SNAP_THRESHOLD) {
                                    preview = { x: 0, y: 0, w: vw / 2, h: vh / 2 };
                                    currentSnap = 'tl';
                                } else if (mouseY > vh - SNAP_THRESHOLD - taskbarH) {
                                    preview = { x: 0, y: vh / 2, w: vw / 2, h: (vh / 2) - taskbarH };
                                    currentSnap = 'bl';
                                } else {
                                    preview = { x: 0, y: 0, w: vw / 2, h: vh - taskbarH };
                                    currentSnap = 'left';
                                }
                            } else if (mouseX > vw - SNAP_THRESHOLD) {
                                // Right
                                if (mouseY < SNAP_THRESHOLD) {
                                    preview = { x: vw / 2, y: 0, w: vw / 2, h: vh / 2 };
                                    currentSnap = 'tr';
                                } else if (mouseY > vh - SNAP_THRESHOLD - taskbarH) {
                                    preview = { x: vw / 2, y: vh / 2, w: vw / 2, h: (vh / 2) - taskbarH };
                                    currentSnap = 'br';
                                } else {
                                    preview = { x: vw / 2, y: 0, w: vw / 2, h: vh - taskbarH };
                                    currentSnap = 'right';
                                }
                            } else if (mouseY < SNAP_THRESHOLD) {
                                // Top Maximize
                                preview = { x: 0, y: 0, w: vw, h: vh - taskbarH };
                                currentSnap = 'maximize';
                            }

                            setSnapPreview(preview);
                        };

                        const onUpWin = () => {
                            document.removeEventListener('pointermove', wrapperMove);
                            document.removeEventListener('pointerup', onUpWin);
                            setIsDragging(false);
                            setSnapPreview(null);

                            if (currentSnap) {
                                if (currentSnap === 'maximize') {
                                    onMaximize(id);
                                } else {
                                    // Calculate actual dimensions based on snap type for persistence
                                    const vw = window.innerWidth;
                                    const vh = window.innerHeight;
                                    const taskbarH = 48;
                                    let snapPos = { x: 0, y: 0 };
                                    let snapSize = { w: vw, h: vh };

                                    if (currentSnap === 'left') { snapPos = { x: 0, y: 0 }; snapSize = { w: vw / 2, h: vh - taskbarH }; }
                                    if (currentSnap === 'right') { snapPos = { x: vw / 2, y: 0 }; snapSize = { w: vw / 2, h: vh - taskbarH }; }
                                    if (currentSnap === 'tl') { snapPos = { x: 0, y: 0 }; snapSize = { w: vw / 2, h: vh / 2 }; }
                                    if (currentSnap === 'tr') { snapPos = { x: vw / 2, y: 0 }; snapSize = { w: vw / 2, h: vh / 2 }; }
                                    if (currentSnap === 'bl') { snapPos = { x: 0, y: vh / 2 }; snapSize = { w: vw / 2, h: (vh / 2) - taskbarH }; }
                                    if (currentSnap === 'br') { snapPos = { x: vw / 2, y: vh / 2 }; snapSize = { w: vw / 2, h: (vh / 2) - taskbarH }; }

                                    if (onSnap) onSnap(id, snapPos, snapSize, currentSnap);
                                }
                            } else {
                                onMove(id, finalPos);
                            }
                        };

                        document.addEventListener('pointermove', wrapperMove);
                        document.addEventListener('pointerup', onUpWin);
                    }}
                    onDoubleClick={() => onMaximize(id)}
                >
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-black tracking-widest uppercase ${isActive ? "text-black" : "text-gray-400"}`}>{title}</span>
                                    </div>
                                    <div className="flex items-center gap-2" onPointerDown={e => e.stopPropagation()}>
                                        <button onClick={() => onMinimize(id)} aria-label="Minimize" className={`p-1 hover:bg-white/20 rounded ${isActive ? "text-black" : "text-white"}`}><Minus size={14} /></button>
                                        <button onClick={() => onMaximize(id)} aria-label="Maximize" className={`p-1 hover:bg-white/20 rounded ${isActive ? "text-black" : "text-white"}`}><Maximize2 size={14} /></button>
                                        <button onClick={() => onClose(id)} aria-label="Close" className={`p-1 hover:bg-red-500 rounded ${isActive ? "text-black" : "text-white"}`}><X size={14} /></button>
                                    </div>
                                </div>
                <div className="flex-1 relative overflow-hidden bg-black/50">
                    {children}
                    {!maximized && (
                        <>
                            {RESIZE_HANDLES.map(dir => (
                                <div
                                    key={dir}
                                    onMouseDown={(e) => handleResizeStart(e, dir)}
                                    className={`absolute z-50 bg-transparent ${dir === 'n' || dir === 's' ? 'cursor-ns-resize h-1 left-2 right-2' :
                                            dir === 'e' || dir === 'w' ? 'cursor-ew-resize w-1 top-2 bottom-2' :
                                                'w-3 h-3 z-50'
                                        } ${dir === 'n' ? 'top-0' :
                                            dir === 's' ? 'bottom-0' :
                                                dir === 'e' ? 'right-0' :
                                                    dir === 'w' ? 'left-0' :
                                                        dir === 'ne' ? 'top-0 right-0 cursor-nesw-resize' :
                                                            dir === 'nw' ? 'top-0 left-0 cursor-nwse-resize' :
                                                                dir === 'se' ? 'bottom-0 right-0 cursor-nwse-resize' :
                                                                    dir === 'sw' ? 'bottom-0 left-0 cursor-nesw-resize' : ''
                                        }`}
                                />
                            ))}
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default WindowFrame;
