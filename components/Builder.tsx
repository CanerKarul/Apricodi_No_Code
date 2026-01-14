
import React, { useState } from 'react';
import { generateAppSchema } from '../services/gemini.ts';
import { AppSchema } from '../types.ts';
import DynamicRenderer from './DynamicRenderer.tsx';
import LeadsModal from './LeadsModal.tsx';

const INITIAL_SCHEMA: AppSchema = {
  appName: "Yeni Uygulama",
  description: "Yapay zeka asistanına ne yapmak istediğini yazarak başla.",
  elements: [
    { id: '1', type: 'heading', label: 'Başlamaya Hazırız!' },
    { id: '2', type: 'card', label: 'Bir Prompt Girin', content: 'Sol taraftaki panelden "Örn: Bir restoran yönetim sistemi yap" gibi bir talimat verin.' }
  ]
};

const Builder: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<AppSchema>(INITIAL_SCHEMA);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const newSchema = await generateAppSchema(prompt);
      setSchema(newSchema);
      setPrompt("");
    } catch (error: any) {
      console.error("Builder Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <div className="w-[350px] border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">
            ← <span className="text-sm">Geri</span>
          </button>
          <span className="text-orange-500 font-black text-sm">APRICODI AI</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl text-sm border border-slate-700/50 text-slate-300">
            Nasıl bir uygulama oluşturmak istersin? Detaylıca anlat, Apricodi hemen tasarlasın.
          </div>

          <div className="flex items-center gap-2 px-1">
             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
               CLOUD PROXY: ACTIVE
             </span>
          </div>
          
          {loading && (
            <div className="flex items-center gap-3 text-orange-500 text-sm animate-pulse pt-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              AI Mimariyi Çiziyor...
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
            placeholder="Örn: Müşteri randevu sistemi..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none h-32 resize-none text-white transition-all disabled:opacity-50"
            disabled={loading}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-4 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/20"
          >
            {loading ? "Oluşturuluyor..." : "Uygulamayı Oluştur"}
          </button>
        </div>
      </div>

      {/* Main Preview */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">{schema.appName} / Preview</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-1.5 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-semibold transition-all">Kodu İndir</button>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 rounded-lg text-sm font-bold">Yayınla</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="min-h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] p-12">
             <div className="bg-slate-950/80 border border-slate-800 rounded-3xl min-h-[80vh] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-600" />
                <DynamicRenderer schema={schema} />
             </div>
          </div>
        </main>
      </div>

      <LeadsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectId="new-id" />
    </div>
  );
};

export default Builder;
