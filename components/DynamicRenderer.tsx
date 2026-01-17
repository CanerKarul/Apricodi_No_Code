
import React from 'react';
import { DynamicElement, AppSchema } from '../types';
import ChatInterface from './ChatInterface.tsx';
import WorkflowVisualizer from './WorkflowVisualizer.tsx';
import AgentCard from './AgentCard.tsx';
import DataVisualization from './DataVisualization.tsx';
import ContactForm from './ContactForm.tsx';

interface DynamicRendererProps {
  schema: AppSchema;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ schema }) => {
  const renderElement = (el: DynamicElement) => {
    switch (el.type) {
      case 'heading':
        return <h2 key={el.id} className="text-2xl font-bold text-white mb-4 mt-6">{el.label}</h2>;

      case 'card':
        return (
          <div key={el.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg mb-4">
            <h3 className="font-semibold text-lg mb-2">{el.label}</h3>
            <p className="text-slate-400">{el.content}</p>
          </div>
        );

      case 'input':
        return (
          <div key={el.id} className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">{el.label}</label>
            <input
              type={el.inputType || 'text'}
              placeholder={el.placeholder}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
        );

      case 'select':
        return (
          <div key={el.id} className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">{el.label}</label>
            <select className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white">
              {el.options?.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );

      case 'button':
        return (
          <button
            key={el.id}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-orange-900/20 active:scale-95 mb-4 mr-2"
          >
            {el.label}
          </button>
        );

      case 'table':
        return (
          <div key={el.id} className="overflow-x-auto mb-8 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  {el.columns?.map((col, i) => (
                    <th key={i} className="px-4 py-3 font-semibold border-b border-slate-800">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(el.data || []).length > 0 ? (
                  el.data?.map((row: any[], i: number) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      {Array.isArray(row) ? row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-slate-400">{cell}</td>
                      )) : null}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={el.columns?.length} className="px-4 py-8 text-center text-slate-500 italic">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'chat':
        return <div key={el.id} className="mb-6"><ChatInterface element={el} /></div>;

      case 'workflow':
        return <div key={el.id} className="mb-6"><WorkflowVisualizer element={el} /></div>;

      case 'agent':
        return <div key={el.id} className="mb-6"><AgentCard element={el} /></div>;

      case 'data-viz':
        return <div key={el.id} className="mb-6"><DataVisualization element={el} /></div>;

      case 'code-block':
        return (
          <div key={el.id} className="mb-6 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-900 px-4 py-2 text-sm text-slate-400 font-mono border-b border-slate-800">
              {el.language || 'code'}
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-slate-300 font-mono">{el.code || '// Code here'}</code>
            </pre>
          </div>
        );

      case 'timeline':
        return (
          <div key={el.id} className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-orange-500">{el.label}</h3>
            <div className="space-y-4">
              {(el.events || []).map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${event.status === 'completed' ? 'bg-green-500' :
                      event.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                        'bg-slate-600'
                      }`}></div>
                    {idx < (el.events?.length || 0) - 1 && (
                      <div className="w-0.5 h-full bg-slate-800 flex-1 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-white">{event.title}</h4>
                        <span className="text-xs text-slate-500">{event.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-400">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'api-connector':
        return (
          <div key={el.id} className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-orange-500">{el.label}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${el.method === 'GET' ? 'bg-green-900 text-green-300' :
                  el.method === 'POST' ? 'bg-blue-900 text-blue-300' :
                    el.method === 'PUT' ? 'bg-yellow-900 text-yellow-300' :
                      el.method === 'DELETE' ? 'bg-red-900 text-red-300' :
                        'bg-slate-800 text-slate-300'
                  }`}>
                  {el.method || 'GET'}
                </span>
                <code className="flex-1 bg-slate-950 px-4 py-2 rounded-lg text-sm text-slate-300 font-mono">
                  {el.endpoint || '/api/endpoint'}
                </code>
              </div>
              {el.headers && Object.keys(el.headers).length > 0 && (
                <div className="bg-slate-950 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Headers</div>
                  {Object.entries(el.headers).map(([key, value]) => (
                    <div key={key} className="text-xs font-mono text-slate-400">
                      <span className="text-orange-500">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'kanban':
        return (
          <div key={el.id} className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-orange-500">{el.label}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {(el.kanbanColumns || []).map((column) => (
                <div key={column.id} className="flex-shrink-0 w-72 bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-3">{column.title}</h4>
                  <div className="space-y-2">
                    {column.items.map((item) => (
                      <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-orange-500 transition-colors cursor-pointer">
                        <div className="font-medium text-sm text-white mb-1">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-slate-400">{item.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact-form':
        return <div key={el.id} className="mb-6"><ContactForm element={el} /></div>;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 animate-in fade-in duration-700">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
          {schema.appName}
        </h1>
        <p className="text-slate-400 mt-2">{schema.description}</p>
      </header>
      <div className="space-y-4">
        {schema.elements.map(renderElement)}
      </div>
    </div>
  );
};

export default DynamicRenderer;
