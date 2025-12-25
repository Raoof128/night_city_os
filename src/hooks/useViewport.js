import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor internal viewport size.
 * Useful for adaptive layouts and security lockouts.
 * 
 * @returns {object} - { width, height, isMobile }
 */
export const useViewport = (breakpoint = 768) => {
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < breakpoint,
    });

    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < breakpoint,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return viewport;
};
