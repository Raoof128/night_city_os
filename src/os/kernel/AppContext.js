import { createContext, useContext } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within an AppContainer');
    return context;
};

export default AppContext;
