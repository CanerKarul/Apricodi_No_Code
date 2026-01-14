
import React from 'react';
import { DynamicElement } from '../types.ts';

const WorkflowVisualizer: React.FC<{ element: DynamicElement }> = ({ element }) => {
    const nodes = element.nodes || [
        { id: '1', type: 'trigger', label: 'Start', description: 'Workflow trigger' },
        { id: '2', type: 'ai', label: 'AI Process', description: 'AI processing step' },
        { id: '3', type: 'action', label: 'Action', description: 'Execute action' }
    ];

    const connections = element.connections || [
        { from: '1', to: '2' },
        { from: '2', to: '3' }
    ];

    const getNodeColor = (type: string) => {
        switch (type) {
            case 'trigger': return 'from-green-600 to-emerald-600';
            case 'ai': return 'from-purple-600 to-pink-600';
            case 'action': return 'from-blue-600 to-cyan-600';
            case 'condition': return 'from-yellow-600 to-orange-600';
            default: return 'from-slate-600 to-slate-700';
        }
    };

    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'trigger': return '⚡';
            case 'ai': return '🤖';
            case 'action': return '⚙️';
            case 'condition': return '🔀';
            default: return '📦';
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold mb-6 text-orange-500">{element.label}</h3>

            <div className="relative">
                <div className="flex items-center justify-center gap-8">
                    {nodes.map((node, idx) => (
                        <React.Fragment key={node.id}>
                            <div className="relative flex flex-col items-center">
                                <div className={`bg-gradient-to-br ${getNodeColor(node.type)} rounded-xl p-4 shadow-lg min-w-[140px] text-center`}>
                                    <div className="text-3xl mb-2">{getNodeIcon(node.type)}</div>
                                    <div className="font-bold text-sm text-white">{node.label}</div>
                                    {node.description && (
                                        <div className="text-xs text-white/70 mt-1">{node.description}</div>
                                    )}
                                </div>
                                <div className="absolute -bottom-6 text-xs text-slate-500 uppercase tracking-wider">
                                    {node.type}
                                </div>
                            </div>

                            {idx < nodes.length - 1 && (
                                <div className="flex items-center">
                                    <div className="w-12 h-0.5 bg-gradient-to-r from-slate-600 to-slate-700"></div>
                                    <div className="text-slate-600">→</div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 text-center">
                    {nodes.length} nodes • {connections.length} connections
                </p>
            </div>
        </div>
    );
};

export default WorkflowVisualizer;
