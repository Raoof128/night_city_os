import { useState, useEffect } from 'react';
import { useApp } from '../os/kernel/AppContext';
import { auditLogger } from '../os/kernel/AuditLog';
import { getCapturedLogs } from '../utils/errorCapture';
import { Search, Filter, Trash2, Download } from 'lucide-react';

const LogsApp = () => {
    const { addNotification } = useApp();
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearchQuery] = useState('');

    const fetchLogs = async () => {
        const securityLogs = await auditLogger.getLogs(200);
        const consoleLogs = getCapturedLogs().map(l => ({
            ...l,
            action: `console:${l.level}`,
            appId: 'system',
            outcome: l.level
        }));
        
        const allLogs = [...securityLogs, ...consoleLogs].sort((a, b) => b.timestamp - a.timestamp);
        setLogs(allLogs);
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                             log.appId.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || 
                             (filter === 'security' && log.action.startsWith('sec:')) ||
                             (filter === 'system' && log.action.startsWith('sys:')) ||
                             (filter === 'error' && log.outcome === 'error');
        return matchesSearch && matchesFilter;
    });

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nc_os_logs_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addNotification({ title: 'Exported', message: 'Logs saved to JSON', type: 'success' });
    };

    const handleClear = async () => {
        if (confirm('Clear all logs permanently?')) {
            await auditLogger.clearLogs();
            fetchLogs();
        }
    };

    return (
        <div className="h-full flex flex-col bg-black text-gray-300 font-mono">
            {/* Toolbar */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-white/5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="FILTER_LOGS..." 
                        value={search}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs outline-none focus:border-[var(--color-yellow)] transition-all"
                    />
                </div>
                
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-black border border-white/10 text-xs px-3 py-1.5 rounded outline-none focus:border-[var(--color-yellow)]"
                >
                    <option value="all">ALL_EVENTS</option>
                    <option value="security">SECURITY</option>
                    <option value="system">SYSTEM</option>
                    <option value="error">ERRORS</option>
                </select>

                <div className="flex-1" />

                <button onClick={handleExport} className="p-2 hover:bg-white/10 rounded text-[var(--color-blue)]" title="Export">
                    <Download size={16} />
                </button>
                <button onClick={handleClear} className="p-2 hover:bg-white/10 rounded text-[var(--color-red)]" title="Clear">
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Log List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-[10px] border-collapse">
                    <thead className="sticky top-0 bg-gray-900 text-gray-500 uppercase tracking-widest border-b border-white/10">
                        <tr>
                            <th className="p-3 font-bold w-32">Timestamp</th>
                            <th className="p-3 font-bold w-24">App</th>
                            <th className="p-3 font-bold w-40">Action</th>
                            <th className="p-3 font-bold">Details</th>
                            <th className="p-3 font-bold w-20">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-3 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-3 font-bold text-[var(--color-blue)]">{log.appId}</td>
                                <td className="p-3 text-[var(--color-yellow)]">{log.action}</td>
                                <td className="p-3 truncate max-w-md opacity-70">{log.details || log.target}</td>
                                <td className="p-3">
                                    <span className={`px-1.5 py-0.5 rounded ${
                                        log.outcome === 'allow' || log.outcome === 'granted' ? 'bg-green-500/20 text-green-500' :
                                        log.outcome === 'deny' || log.outcome === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                                    }`}>
                                        {log.outcome.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="p-20 text-center text-gray-600 italic">NO_RECORDS_MATCH_QUERY</div>
                )}
            </div>
        </div>
    );
};

export default LogsApp;
