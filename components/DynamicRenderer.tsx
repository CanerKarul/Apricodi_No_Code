
import React from 'react';
import { DynamicElement, AppSchema } from '../types';

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

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 animate-in fade-in duration-700">
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
