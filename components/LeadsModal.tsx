
import React, { useState } from 'react';

interface LeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const LeadsModal: React.FC<LeadsModalProps> = ({ isOpen, onClose, projectId }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Supabase logic
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-600/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Apricodi Pro'ya Geçin</h2>
              <p className="text-slate-400 text-sm">Bu projeyi canlıya almak, özel domain bağlamak ve kaynak kodlarını indirmek için Pro lisans gereklidir.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                required
                placeholder="Ad Soyad" 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" 
              />
              <input 
                required
                type="email" 
                placeholder="E-posta Adresi" 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" 
              />
              <input 
                required
                placeholder="Şirket / Proje Adı" 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" 
              />
              <button 
                disabled={loading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
              >
                {loading ? 'Gönderiliyor...' : 'Satış Ekibiyle Görüş'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-600/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Talebiniz Alındı!</h2>
            <p className="text-slate-400">Satış ekibimiz sizinle en kısa sürede iletişime geçecek. Harika bir uygulama bizi bekliyor!</p>
            <button 
              onClick={onClose}
              className="mt-6 text-orange-500 hover:underline"
            >
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsModal;
