
import React, { useState, useRef, useEffect } from 'react';
import { DynamicElement } from '../types.ts';

const ChatInterface: React.FC<{ element: DynamicElement }> = ({ element }) => {
    const [messages, setMessages] = useState(element.messages || [
        { role: 'assistant' as const, content: 'Merhaba! Size nasıl yardımcı olabilirim?', timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Simple keyword-based response system
    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        // Check QA database first
        if (element.qaDatabase && element.qaDatabase.length > 0) {
            for (const qa of element.qaDatabase) {
                const questionMatch = qa.question.toLowerCase().includes(lowerMessage) ||
                    lowerMessage.includes(qa.question.toLowerCase());

                const keywordMatch = qa.keywords?.some(keyword =>
                    lowerMessage.includes(keyword.toLowerCase())
                );

                if (questionMatch || keywordMatch) {
                    return qa.answer;
                }
            }
        }

        // Use company info for context-aware responses
        const companyInfo = element.companyInfo;

        // Product/Service inquiries
        if (lowerMessage.includes('ürün') || lowerMessage.includes('product') ||
            lowerMessage.includes('hizmet') || lowerMessage.includes('service')) {
            if (companyInfo?.products && companyInfo.products.length > 0) {
                return `Ürünlerimiz: ${companyInfo.products.join(', ')}. ${companyInfo.description || 'Daha fazla bilgi için bizimle iletişime geçebilirsiniz.'}`;
            }
            if (companyInfo?.services && companyInfo.services.length > 0) {
                return `Hizmetlerimiz: ${companyInfo.services.join(', ')}. ${companyInfo.description || 'Detaylı bilgi almak ister misiniz?'}`;
            }
        }

        // Company info inquiries
        if (lowerMessage.includes('hakkında') || lowerMessage.includes('about') ||
            lowerMessage.includes('kim') || lowerMessage.includes('who')) {
            if (companyInfo?.name && companyInfo?.description) {
                return `${companyInfo.name} olarak ${companyInfo.description}`;
            }
        }

        // Pricing inquiries
        if (lowerMessage.includes('fiyat') || lowerMessage.includes('price') ||
            lowerMessage.includes('ücret') || lowerMessage.includes('cost')) {
            return 'Fiyatlandırma bilgisi için satış ekibimizle iletişime geçebilirsiniz. Size özel bir teklif hazırlayabiliriz.';
        }

        // Contact inquiries
        if (lowerMessage.includes('iletişim') || lowerMessage.includes('contact') ||
            lowerMessage.includes('ulaş') || lowerMessage.includes('reach')) {
            return 'Bizimle iletişime geçmek için formu doldurabilir veya doğrudan e-posta gönderebilirsiniz. Size en kısa sürede dönüş yapacağız.';
        }

        // Demo/Trial inquiries
        if (lowerMessage.includes('demo') || lowerMessage.includes('deneme') ||
            lowerMessage.includes('trial') || lowerMessage.includes('test')) {
            return 'Ücretsiz demo talebiniz için formu doldurabilirsiniz. Ekibimiz sizinle iletişime geçerek demo sürecini başlatacaktır.';
        }

        // Greeting responses
        if (lowerMessage.includes('merhaba') || lowerMessage.includes('hello') ||
            lowerMessage.includes('hi') || lowerMessage.includes('selam')) {
            return `Merhaba! ${companyInfo?.name ? companyInfo.name + ' chatbot\'una hoş geldiniz.' : 'Size nasıl yardımcı olabilirim?'}`;
        }

        // Thank you responses
        if (lowerMessage.includes('teşekkür') || lowerMessage.includes('thank') ||
            lowerMessage.includes('sağol')) {
            return 'Rica ederim! Başka bir konuda yardımcı olabilir miyim?';
        }

        // Default fallback
        const personality = element.botPersonality || 'yardımcı ve profesyonel';
        return `Bu konuda size yardımcı olmak isterim. ${companyInfo?.name ? companyInfo.name + ' hakkında' : ''} daha spesifik bir soru sorabilir misiniz? Örneğin ürünlerimiz, hizmetlerimiz veya fiyatlandırma hakkında bilgi alabilirsiniz.`;
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            role: 'user' as const,
            content: inputValue,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const response = generateResponse(inputValue);
            const assistantMessage = {
                role: 'assistant' as const,
                content: response,
                timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 800 + Math.random() * 700); // Random delay between 800-1500ms
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white font-bold flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {element.label}
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-slate-950/30">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-orange-600 to-orange-500 text-white'
                                    : 'bg-slate-800 text-slate-100 border border-slate-700'
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            {msg.timestamp && (
                                <p className="text-xs opacity-60 mt-1.5">{msg.timestamp}</p>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
                    >
                        Gönder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
