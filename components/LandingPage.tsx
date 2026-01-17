
import React, { useState } from 'react';
import ContactForm from './ContactForm.tsx';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-orange-600/10 blur-[120px] rounded-full -z-10" />

      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-orange-500 tracking-tighter">APRICODI</div>
        <button onClick={onStart} className="px-6 py-2 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors">Giriş Yap</button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-24 pb-32 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-slate-900 border border-slate-800 text-orange-500 text-sm font-medium mb-6">
          ✨ Yapay Zeka ile No-Code Devrimi
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
          Hayalindeki Yazılımı <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600">
            Kod Yazmadan Oluştur
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Fikrinizi söyleyin, Apricodi sizin için tam fonksiyonel bir SaaS uygulamasını saniyeler içinde tasarlasın ve kodlasın.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStart}
            className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl text-lg shadow-xl shadow-orange-900/40 transition-all hover:-translate-y-1"
          >
            Ücretsiz Başla
          </button>
          <button
            onClick={() => setShowContactForm(true)}
            className="px-10 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-2xl text-lg font-bold transition-all"
          >
            Satış Ekibiyle Görüş
          </button>
        </div>

        <div className="mt-24 relative">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl relative z-10">
            <img
              src="https://picsum.photos/1200/600?grayscale"
              alt="Dashboard Preview"
              className="rounded-2xl opacity-60 mix-blend-screen"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20" />
        </div>
      </main>

      <footer className="border-t border-slate-900 py-12 text-center text-slate-500">
        &copy; 2024 Apricodi AI Platform. All rights reserved.
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ContactForm
              element={{
                label: 'Satış Ekibiyle İletişime Geçin',
                description: 'Apricodi AI Builder hakkında daha fazla bilgi almak veya demo talep etmek için formu doldurun.'
              }}
              onSuccess={() => setShowContactForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
