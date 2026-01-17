
import React, { useState, useEffect } from 'react';
import { getUserProjects, updateProject, supabase } from '../services/supabase.ts';
import { Project } from '../types.ts';
import { User } from '../types.ts';

interface DashboardProps {
  onNewProject: () => void;
  onLogout: () => void;
  onEditProject: (projectId: string) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewProject, onLogout, onEditProject, user }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, [user.id]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userProjects = await getUserProjects(user.id);
      setProjects(userProjects);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError('Projeler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Remove from local state
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err: any) {
      console.error('Error deleting project:', err);
      alert('Proje silinirken bir hata oluştu.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays === 1) {
      return 'Dün';
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold">Projelerim</h1>
          <p className="text-slate-400">
            Hoş geldin{user.name ? `, ${user.name}` : ''}! İşte senin eserlerin.
          </p>
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Projeler yükleniyor...</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Henüz proje yok</h3>
          <p className="text-slate-400 mb-6">İlk projenizi oluşturarak başlayın!</p>
          <button
            onClick={onNewProject}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20"
          >
            + İlk Projeyi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-orange-600/20 group-hover:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500">{formatDate(p.created_at!)}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2">{p.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditProject(p.id)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
