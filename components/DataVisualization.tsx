
import React from 'react';
import { DynamicElement } from '../types.ts';

const DataVisualization: React.FC<{ element: DynamicElement }> = ({ element }) => {
    const chartType = element.chartType || 'bar';
    const metrics = element.metrics || [
        { label: 'Sales', value: 75, color: 'bg-green-500' },
        { label: 'Users', value: 60, color: 'bg-blue-500' },
        { label: 'Revenue', value: 90, color: 'bg-purple-500' }
    ];

    if (chartType === 'metric') {
        return (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold mb-4 text-orange-500">{element.label}</h3>
                <div className="grid grid-cols-3 gap-4">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-slate-800 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                            <div className="text-sm text-slate-400">{metric.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (chartType === 'progress') {
        return (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold mb-4 text-orange-500">{element.label}</h3>
                <div className="space-y-4">
                    {metrics.map((metric, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-300">{metric.label}</span>
                                <span className="text-slate-400">{metric.value}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${metric.color || 'bg-orange-500'} transition-all duration-500`}
                                    style={{ width: `${metric.value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Bar chart (default)
    const maxValue = Math.max(...metrics.map(m => typeof m.value === 'number' ? m.value : 0));

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold mb-6 text-orange-500">{element.label}</h3>
            <div className="flex items-end justify-around h-64 gap-4">
                {metrics.map((metric, idx) => {
                    const height = typeof metric.value === 'number' ? (metric.value / maxValue) * 100 : 0;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                                <div
                                    className={`w-full ${metric.color || 'bg-orange-500'} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer`}
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                                        {metric.value}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 text-center">{metric.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DataVisualization;
