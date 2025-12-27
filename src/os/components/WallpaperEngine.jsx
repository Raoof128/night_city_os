import { useEffect, useRef, useState } from 'react';
import { useOS } from '../hooks/useOS';
import { EventBus } from '../kernel/eventBus';

const WallpaperEngine = () => {
    const { state } = useOS();
    const { flags, quickSettings } = state;
    const canvasRef = useRef(null);
    const [isEnabled, setIsEnabled] = useState(false);

    // Performance Guardrails
    const isPerformanceLimited = quickSettings.reducedMotion || quickSettings.performanceMode;

    useEffect(() => {
        const canRun = flags.liveWallpaper && !isPerformanceLimited;
        setIsEnabled(canRun);
        
        if (flags.liveWallpaper && isPerformanceLimited) {
            EventBus.emit('sys:log', { 
                level: 'warn', 
                message: 'Live wallpaper disabled due to performance profile.' 
            });
        }
    }, [flags.liveWallpaper, isPerformanceLimited]);

    useEffect(() => {
        if (!isEnabled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;
        let particles = [];
        let lastTime = performance.now();
        let frameTimes = [];

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = Array.from({ length: 50 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: Math.random() > 0.5 ? '#00F0FF' : '#FF003C'
            }));
        };

        const animate = (time) => {
            // Monitor Performance
            const delta = time - lastTime;
            lastTime = time;
            
            frameTimes.push(delta);
            if (frameTimes.length > 60) {
                frameTimes.shift();
                const avg = frameTimes.reduce((a, b) => a + b) / 60;
                // If average frame time > 33ms (under 30fps), auto-disable
                if (avg > 33) {
                    setIsEnabled(false);
                    EventBus.emit('sys:log', { 
                        level: 'error', 
                        message: 'Wallpaper disabled: System lag detected.' 
                    });
                    return;
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connecting lines
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist / 100})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            });

            frame = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', handleResize);
        };
    }, [isEnabled]);

    if (!isEnabled) return null;

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 opacity-30 pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default WallpaperEngine;
