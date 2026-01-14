
import React, { useState } from 'react';
import { Project } from '../types';

interface DashboardProps {
  onNewProject: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewProject, onLogout }) => {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-Ticaret Paneli',
      description: 'Stok ve satış takibi için özel dashboard.',
      createdAt: '2 saat önce',
      schema: { appName: 'Mock', description: '', elements: [] }
    },
    {
      id: '2',
      name: 'Müşteri Kayıt Sistemi',
      description: 'Basit CRM uygulaması.',
      createdAt: 'Dün',
      schema: { appName: 'Mock', description: '', elements: [] }
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold">Projelerim</h1>
          <p className="text-slate-400">Hoş geldin, işte senin eserlerin.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onLogout}
            className="px-4 py-2 text-slate-400 hover:text-white"
          >
            Çıkış
          </button>
          <button 
            onClick={onNewProject}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20"
          >
            + Yeni Proje Oluştur
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500/50 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-orange-600/20 group-hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <span className="text-xs text-slate-500">{p.createdAt}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{p.description}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors">Düzenle</button>
              <button className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
