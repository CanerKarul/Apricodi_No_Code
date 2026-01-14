
import React from 'react';
import { DynamicElement } from '../types.ts';

const AgentCard: React.FC<{ element: DynamicElement }> = ({ element }) => {
    const capabilities = element.capabilities || ['Natural Language Processing', 'Data Analysis', 'Task Automation'];
    const status = element.status || 'active';
    const description = element.description || 'AI Agent ready to assist';

    const statusColors = {
        active: 'bg-green-500',
        idle: 'bg-yellow-500',
        processing: 'bg-blue-500 animate-pulse'
    };

    const statusLabels = {
        active: 'Active',
        idle: 'Idle',
        processing: 'Processing'
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center text-2xl">
                        🤖
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">{element.label}</h3>
                        <p className="text-sm text-slate-400">{description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                        {statusLabels[status]}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {capabilities.map((cap, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300"
                            >
                                {cap}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-700 flex gap-2">
                    <button className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-sm font-semibold transition-colors">
                        Configure
                    </button>
                    <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-semibold transition-colors">
                        View Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentCard;
