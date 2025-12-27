import { ShieldAlert } from 'lucide-react';

const LinuxStub = () => {
    return (
        <div className="h-full bg-[#0c0c0c] text-green-500 font-mono p-10 flex flex-col items-center justify-center text-center">
            <div className="mb-6 p-4 border-2 border-red-500 animate-pulse">
                <ShieldAlert size={48} className="mx-auto mb-2 text-red-500" />
                <h2 className="text-xl font-bold">EXPERIMENTAL_RUNTIME</h2>
            </div>
            
            <p className="max-w-md text-sm mb-8 leading-relaxed">
                You are attempting to launch a virtualized x86 Linux kernel. 
                This feature requires the <span className="text-white">v86</span> or <span className="text-white">CheerpX</span> 
                WASM modules to be indexed in your local shards.
            </p>

            <div className="space-y-2 text-xs text-gray-500 uppercase tracking-widest">
                <div>Memory: 512MB Reserved</div>
                <div>Network: Isolated Bridge</div>
                <div>Storage: /dev/vda (Mapped to OPFS)</div>
            </div>

            <button className="mt-10 px-6 py-2 bg-green-900/30 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all font-bold">
                INIT_BOOT_SEQUENCE
            </button>
        </div>
    );
};

export default LinuxStub;
