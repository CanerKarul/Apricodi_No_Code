
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import Builder from './components/Builder.tsx';
import Register from './components/Register.tsx';
import { User } from './types.ts';
import { supabase, getUserProjects } from './services/supabase.ts';
import { AppSchema } from './types.ts';

const LoginPage: React.FC<{ onLogin: (email: string, password: string) => Promise<void> }> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    await onLogin(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-950">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Hoş Geldiniz</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required name="email" type="email" placeholder="E-posta" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white" />
          <input required name="password" type="password" placeholder="Şifre" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white" />
          <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold">Giriş Yap</button>
        </form>
        <p className="mt-4 text-center text-slate-500 text-sm">
          Hesabınız yok mu? <button onClick={() => navigate('/register')} className="text-orange-500 hover:text-orange-400 font-semibold">Kayıt Ol</button>
        </p>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<{ id: string; schema: AppSchema } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          company: session.user.user_metadata?.company,
          created_at: session.user.created_at
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          company: session.user.user_metadata?.company,
          created_at: session.user.created_at
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Giriş yapılırken bir hata oluştu.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleEditProject = async (projectId: string) => {
    try {
      const projects = await getUserProjects(user!.id);
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setEditingProject({ id: project.id, schema: project.schema });
        navigate('/builder/edit/' + projectId);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Proje yüklenirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage onStart={() => navigate('/login')} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/register"
        element={
          <Register
            onSuccess={() => navigate('/dashboard')}
            onBackToLogin={() => navigate('/login')}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard
              onNewProject={() => {
                setEditingProject(null);
                navigate('/builder/new');
              }}
              onLogout={handleLogout}
              onEditProject={handleEditProject}
              user={user}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/builder/:mode/:projectId?"
        element={
          user ? (
            <Builder
              onBack={() => {
                setEditingProject(null);
                navigate('/dashboard');
              }}
              user={user}
              projectId={editingProject?.id}
              initialSchema={editingProject?.schema}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-100 bg-slate-950">
        <AppContent />
      </div>
    </BrowserRouter>
  );
};

export default App;
