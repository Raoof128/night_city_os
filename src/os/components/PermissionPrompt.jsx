import { Shield, Check, X } from 'lucide-react';
import { useOS } from '../hooks/useOS';
import { getAppManifest } from '../kernel/registry';
import { FocusTrap } from '../../components/FocusTrap';

const PermissionPrompt = () => {
    const { state, actions } = useOS();
    const { permissionRequest } = state;

    if (!permissionRequest) return null;

    const { appId, permission, reqId } = permissionRequest;
    const app = getAppManifest(appId) || { name: appId };

    const handleResolve = (decision) => {
        // Dispatch to Reducer to close prompt and save state
        actions.resolvePermission(appId, permission, decision);
        
        // Dispatch DOM event to resolve the Promise in PermissionManager
        window.dispatchEvent(new CustomEvent('sys:perm_resolved', {
            detail: { reqId, decision }
        }));
    };

    return (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <FocusTrap isActive={true}>
                <div className="w-80 bg-[#1a1a1a] border border-[var(--color-yellow)] p-6 rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-center mb-4 text-[var(--color-yellow)]">
                        <Shield size={48} />
                    </div>
                    
                    <h3 className="text-center font-bold text-white text-lg mb-2">
                        PERMISSION REQUEST
                    </h3>
                    
                    <p className="text-center text-sm text-gray-400 mb-6">
                        <span className="text-white font-bold">{app.name}</span> wants to access:
                        <br />
                        <span className="text-[var(--color-blue)] font-mono">{permission}</span>
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleResolve('denied')}
                            className="flex-1 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 font-bold rounded flex items-center justify-center gap-2 transition-colors"
                        >
                            <X size={16} /> DENY
                        </button>
                        <button
                            onClick={() => handleResolve('granted')}
                            className="flex-1 py-2 bg-[var(--color-yellow)] text-black font-bold rounded hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-colors"
                        >
                            <Check size={16} /> ALLOW
                        </button>
                    </div>
                </div>
            </FocusTrap>
        </div>
    );
};

export default PermissionPrompt;
