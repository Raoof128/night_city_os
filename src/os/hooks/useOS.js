import { useContext } from 'react';
import { OSContext } from '../store/OSContext';

export const useOS = () => {
    const context = useContext(OSContext);
    if (!context) throw new Error('useOS must be used within an OSProvider');
    return context;
};
