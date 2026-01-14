
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Builder from './components/Builder';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Router
  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleLogin = (email: string) => {
    setUser({ id: 'mock-user-id', email });
    navigate('#/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('#/');
  };

  const renderPage = () => {
    if (currentPath === '#/' || !currentPath) {
      return <LandingPage onStart={() => navigate('#/login')} />;
    }

    if (currentPath === '#/login') {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Hoş Geldiniz</h1>
            <form onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              handleLogin(email);
            }} className="space-y-4">
              <input required name="email" type="email" placeholder="E-posta" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg" />
              <input required name="password" type="password" placeholder="Şifre" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg" />
              <button className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold">Giriş Yap</button>
            </form>
            <p className="mt-4 text-center text-slate-500 text-sm">
              Hesabınız yok mu? <button className="text-orange-500">Kayıt Ol</button>
            </p>
          </div>
        </div>
      );
    }

    if (!user) {
      navigate('#/login');
      return null;
    }

    if (currentPath === '#/dashboard') {
      return <Dashboard onNewProject={() => navigate('#/builder/new')} onLogout={handleLogout} />;
    }

    if (currentPath.startsWith('#/builder')) {
      return <Builder onBack={() => navigate('#/dashboard')} />;
    }

    return <div className="p-8 text-center">404 - Sayfa Bulunamadı</div>;
  };

  return <div className="min-h-screen text-slate-100">{renderPage()}</div>;
};

export default App;
