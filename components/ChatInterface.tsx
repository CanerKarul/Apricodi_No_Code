
import React from 'react';
import { DynamicElement } from '../types.ts';

const ChatInterface: React.FC<{ element: DynamicElement }> = ({ element }) => {
    const messages = element.messages || [
        { role: 'assistant', content: 'Hello! How can I help you today?', timestamp: '10:00 AM' }
    ];

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white font-bold">
                {element.label}
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-slate-800 text-slate-100'
                                }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                            {msg.timestamp && (
                                <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled
                    />
                    <button className="bg-orange-600 hover:bg-orange-500 px-6 py-2 rounded-lg font-semibold text-sm transition-colors">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
