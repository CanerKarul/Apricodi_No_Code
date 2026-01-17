
import React, { useState } from 'react';
import { createLead } from '../services/supabase.ts';

interface ContactFormProps {
    element?: {
        label?: string;
        description?: string;
    };
    onSuccess?: () => void;
    projectId?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ element, onSuccess, projectId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        interest_area: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createLead({
                ...formData,
                project_id: projectId || null
            });

            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                message: '',
                interest_area: ''
            });

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            }
        } catch (err: any) {
            console.error('Lead submission error:', err);
            setError(err.message || 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mesajınız Alındı!</h3>
                <p className="text-slate-400">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">
                {element?.label || 'Bizimle İletişime Geçin'}
            </h3>
            {element?.description && (
                <p className="text-slate-400 text-sm mb-6">{element.description}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Ad Soyad <span className="text-orange-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="Adınız ve soyadınız"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            E-posta <span className="text-orange-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="ornek@email.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Telefon <span className="text-orange-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="+90 5XX XXX XX XX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Şirket <span className="text-orange-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="Şirket adı"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        İlgi Alanı
                    </label>
                    <select
                        name="interest_area"
                        value={formData.interest_area}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    >
                        <option value="">Seçiniz</option>
                        <option value="demo">Demo Talebi</option>
                        <option value="pricing">Fiyatlandırma Bilgisi</option>
                        <option value="partnership">İş Ortaklığı</option>
                        <option value="support">Teknik Destek</option>
                        <option value="other">Diğer</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Mesajınız <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Gönderiliyor...
                        </span>
                    ) : (
                        'Gönder'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
