
import React, { useState, useEffect } from 'react';
import { generateAppSchema } from '../services/gemini.ts';
import { AppSchema } from '../types.ts';
import DynamicRenderer from './DynamicRenderer.tsx';
import LeadsModal from './LeadsModal.tsx';
import { createProject, updateProject } from '../services/supabase.ts';
import { User } from '../types.ts';

const INITIAL_SCHEMA: AppSchema = {
  appName: "Yeni Uygulama",
  description: "Yapay zeka asistanına ne yapmak istediğini yazarak başla.",
  elements: [
    { id: '1', type: 'heading', label: 'Başlamaya Hazırız!' },
    { id: '2', type: 'card', label: 'Bir Prompt Girin', content: 'Sol taraftaki panelden "Örn: Bir restoran yönetim sistemi yap" gibi bir talimat verin.' }
  ]
};

interface BuilderProps {
  onBack: () => void;
  user: User;
  projectId?: string;
  initialSchema?: AppSchema;
}

const Builder: React.FC<BuilderProps> = ({ onBack, user, projectId, initialSchema }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<AppSchema>(initialSchema || INITIAL_SCHEMA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(projectId);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  useEffect(() => {
    if (schema !== INITIAL_SCHEMA && schema !== initialSchema) {
      setSaveStatus('unsaved');
    }
  }, [schema]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const newSchema = await generateAppSchema(prompt);
      setSchema(newSchema);
      setPrompt("");
      setSaveStatus('unsaved');
    } catch (error: any) {
      console.error("Builder Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async () => {
    if (!schema || schema === INITIAL_SCHEMA) {
      alert('Lütfen önce bir uygulama oluşturun.');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');

    try {
      if (currentProjectId) {
        // Update existing project
        await updateProject(currentProjectId, {
          name: schema.appName,
          description: schema.description,
          schema: schema
        });
      } else {
        // Create new project
        const newProject = await createProject({
          user_id: user.id,
          name: schema.appName,
          description: schema.description,
          schema: schema
        });
        setCurrentProjectId(newProject.id);
      }
      setSaveStatus('saved');
      alert('Proje başarıyla kaydedildi!');
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Proje kaydedilirken bir hata oluştu: ' + error.message);
      setSaveStatus('unsaved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <div className="w-[380px] border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">
            ← <span className="text-sm">Geri</span>
          </button>
          <span className="text-orange-500 font-black text-sm">APRICODI AI</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 p-4 rounded-xl text-sm border border-orange-800/50">
            <h3 className="font-bold text-orange-400 mb-2">🚀 AI Uygulama Oluşturucu</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              İstediğiniz uygulamanın demosunu yapay zeka ile oluşturun. Detaylı açıklama yapın, AI sizin için tasarlasın!
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Örnek Promptlar</h4>
            <div className="space-y-2">
              {[
                "Müşteri destek chatbot'u oluştur - TechCorp adlı yazılım şirketi için, ürünlerimiz: AI Analytics, Cloud Platform, API Gateway",
                "E-ticaret sitesi için sipariş takip chatbot'u yap - müşteriler sipariş durumunu sorgulayabilsin",
                "Satış analitik dashboard'u tasarla - aylık satışlar, müşteri sayısı, gelir grafiklerini göster",
                "Restoran rezervasyon chatbot'u - Bella Italia restoranı için, menü bilgisi ve rezervasyon alabilsin",
                "Multi-agent araştırma asistanı - web'den veri toplasın ve analiz etsin"
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(example)}
                  className="w-full text-left px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 hover:text-white transition-all"
                >
                  💡 {example}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
              AI READY
            </span>
          </div>

          {loading && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-3 text-orange-500 text-sm animate-pulse mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                AI Uygulamayı Oluşturuyor...
              </div>
              <p className="text-xs text-slate-400">Bu birkaç saniye sürebilir</p>
            </div>
          )}

          {/* Save Status Indicator */}
          {saveStatus !== 'saved' && schema !== INITIAL_SCHEMA && (
            <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-amber-500 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Kaydedilmemiş değişiklikler
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900 space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
            placeholder="Örn: AI destekli müşteri hizmetleri chatbot'u oluştur. Sık sorulan soruları yanıtlasın, sipariş takibi yapsın..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none h-32 resize-none text-white transition-all disabled:opacity-50"
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/20"
          >
            {loading ? "Oluşturuluyor..." : "Uygulamayı Oluştur"}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveProject}
            disabled={saving || schema === INITIAL_SCHEMA}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95 border border-slate-700"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Kaydediliyor...
              </span>
            ) : saveStatus === 'saved' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Kaydedildi
              </span>
            ) : (
              "Projeyi Kaydet"
            )}
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

      <LeadsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectId={currentProjectId || 'new-id'} />
    </div>
  );
};

export default Builder;
