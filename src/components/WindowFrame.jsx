import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Maximize2, X } from 'lucide-react';
import { COLORS } from '../utils/theme';

const RESIZE_HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

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
    zIndex
}) => {
    const { id, title, minimized, maximized, pos, size } = item;

    // Local state for smooth dragging/resizing
    const [localPos, setLocalPos] = useState(pos || { x: 100, y: 100 });
    const [localSize, setLocalSize] = useState(size || { w: 800, h: 600 });
    const [isDragging, setIsDragging] = useState(false);

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

        // Use mutable ref values for the listeners to avoid stale closure issues
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

                    const wrapperMove = (ev) => {
                        const newX = ev.clientX - startX;
                        const newY = ev.clientY - startY;
                        const clampedY = Math.max(0, Math.min(window.innerHeight - 40, newY));
                        finalPos = { x: newX, y: clampedY };
                        setLocalPos(finalPos);
                    };

                    const onUpWin = () => {
                        document.removeEventListener('pointermove', wrapperMove);
                        document.removeEventListener('pointerup', onUpWin);
                        setIsDragging(false);
                        onMove(id, finalPos);
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
                    <button onClick={() => onMinimize(id)} className={`p-1 hover:bg-white/20 rounded ${isActive ? "text-black" : "text-white"}`}><Minus size={14} /></button>
                    <button onClick={() => onMaximize(id)} className={`p-1 hover:bg-white/20 rounded ${isActive ? "text-black" : "text-white"}`}><Maximize2 size={14} /></button>
                    <button onClick={() => onClose(id)} className={`p-1 hover:bg-red-500 rounded ${isActive ? "text-black" : "text-white"}`}><X size={14} /></button>
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
    );
};

export default WindowFrame;
