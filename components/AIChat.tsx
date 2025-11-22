
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Sparkles, Loader2, Minimize2 } from 'lucide-react';
import { Button } from './ui/Button';
import { StorageService } from '../services/storage';
import { INITIAL_SERVICES } from '../types';

// Constants
const SYSTEM_INSTRUCTION = `You are the AI Beauty Assistant for "KISHA BEAUTY BOX", a high-end nail and braiding salon.
Your goal is to be friendly, professional, and helpful. 
You speak English.
Use emojis occasionally to be friendly ✨.

Key Information about the Shop:
- Name: KISHA BEAUTY BOX
- Phone: +1 (781) 258-0779
- Payment methods: Cash, Zelle, CashApp.
- Deposit Policy: $20 non-refundable deposit required.
- Location: (If asked, say "We are located in the heart of the city, please contact us for the exact address.")

Services Offered (prices are in USD):
${INITIAL_SERVICES.map(s => `- ${s.name}: $${s.price} (${s.durationMinutes} min)`).join('\n')}

Rules:
1. Answer questions about services, prices, and booking.
2. If a user wants to book, guide them to use the main booking form on the website.
3. Do not make up services that are not listed.
4. Keep answers concise (under 50 words usually).
`;

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const AIChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello! 👋 I'm Kisha's AI assistant. How can I help you with your glow-up today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [settings] = useState(StorageService.getSettings());

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            // Safety check for API Key
            const apiKey = process?.env?.API_KEY;
            if (!apiKey) {
                throw new Error("API Key is missing. Please contact the administrator.");
            }

            const ai = new GoogleGenAI({ apiKey });
            
            // Generate content
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    { role: 'user', parts: [{ text: userMessage }] } // Simple stateless request for demo or maintain history if needed
                ],
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                }
            });

            const reply = response.text || "I'm sorry, I couldn't understand that right now. ✨";
            
            setMessages(prev => [...prev, { role: 'model', text: reply }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Oops! My connection is a bit fuzzy. Please try again later or contact the shop directly. 💅" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-stone-900 text-white p-4 rounded-full shadow-2xl hover:bg-stone-800 hover:scale-105 transition-all animate-fade-in-up"
                    aria-label="Open AI Chat"
                >
                    <Sparkles className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[90vw] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-stone-200 animate-fade-in-up overflow-hidden font-sans">
                    {/* Header */}
                    <div className="bg-stone-900 text-white p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/10 p-1.5 rounded-lg">
                                <Sparkles className="w-4 h-4 text-brand-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Beauty Assistant</h3>
                                <p className="text-[10px] text-stone-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-stone-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                                        max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                        ${msg.role === 'user' 
                                            ? 'bg-stone-800 text-white rounded-tr-none' 
                                            : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none'}
                                    `}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                                    <span className="text-xs text-stone-400">Typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-stone-100 shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask about nails, prices..."
                                className="flex-grow p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:bg-white transition-all"
                            />
                            <Button 
                                onClick={handleSend} 
                                size="sm" 
                                disabled={isLoading || !input.trim()}
                                className="rounded-xl px-4"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="text-center mt-2">
                             <p className="text-[10px] text-stone-300">AI can make mistakes. Contact shop for final details.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
