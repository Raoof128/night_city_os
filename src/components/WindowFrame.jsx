import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Maximize2, X } from 'lucide-react';
import { COLORS } from '../utils/theme';

const WindowFrame = ({
  title,
  icon: Icon,
  children,
  onClose,
  onMinimize,
  isActive,
  onFocus,
  initialPos,
  isMinimized,
  zIndex,
  constraintsRef,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (isMinimized) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        width: isMaximized ? '100%' : '800px',
        height: isMaximized ? 'calc(100% - 48px)' : '500px',
        top: isMaximized ? 0 : initialPos?.y || '100px',
        left: isMaximized ? 0 : initialPos?.x || 'calc(50% - 400px)',
        position: 'absolute',
      }}
      exit={{ scale: 0.95, opacity: 0, duration: 0.1 }}
      onMouseDown={onFocus}
      data-testid="window-frame"
      className={`flex flex-col transition-all duration-200 backdrop-blur-md`}
      style={{
        zIndex: zIndex,
        backgroundColor: 'rgba(0, 0, 0, 0.85)', // Glassmorphism base
        border: `1px solid ${isActive ? COLORS.YELLOW : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isActive
          ? `0 0 20px rgba(0,0,0,0.5), 0 0 0 1px ${COLORS.YELLOW}`
          : '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div
        className="h-10 flex items-center justify-between px-4 select-none cursor-move active:cursor-grabbing relative overflow-hidden group"
        style={{ backgroundColor: isActive ? 'rgba(255, 224, 0, 0.9)' : 'rgba(30, 30, 30, 0.8)' }}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        {/* Decorative stripe */}
        <div className="absolute top-0 right-0 w-32 h-full bg-white opacity-5 skew-x-[-45deg] translate-x-10 group-hover:translate-x-0 transition-transform duration-500"></div>

        <div className="flex items-center gap-2 z-10">
          <Icon size={16} className={isActive ? 'text-black' : 'text-gray-400'} />
          <span
            className={`text-xs font-black tracking-widest uppercase ${isActive ? 'text-black' : 'text-gray-400'}`}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className={`p-1 transition-colors rounded hover:bg-black/10 ${isActive ? 'text-black' : 'text-gray-400'}`}
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className={`p-1 transition-colors rounded hover:bg-black/10 ${isActive ? 'text-black' : 'text-gray-400'}`}
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`p-1 transition-colors rounded hover:bg-red-500 hover:text-white ${isActive ? 'text-black' : 'text-gray-400'}`}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar p-0 relative bg-black/50">
        {/* Scanline overlay for aesthetic */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${COLORS.BLUE} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.BLUE} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </motion.div>
  );
};

export default WindowFrame;
