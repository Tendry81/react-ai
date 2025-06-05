'use client';

import { useAppContext } from '@/context/AppContext';
import { formatMessageContent } from '@/lib/formattingUtils';
import React, { useEffect, useRef } from 'react';
import TypingIndicator from './TypingIndicator';

const ChatMessages: React.FC = () => {
    const { messages, isTyping } = useAppContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="h-full overflow-y-auto px-4">
            <div className="py-4 space-y-4">
                {/* Welcome Message */}
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                            <p className="text-gray-300 mb-2">👋 Welcome to Ask AI - Your React Code Assistant!</p>
                            <p className="text-sm text-gray-400">I specialize in helping with:</p>
                            <ul className="text-sm text-gray-400 mt-2 space-y-1">
                                <li>• Next.js applications</li>
                                <li>• React components</li>
                                <li>• Tailwind CSS styling</li>
                                <li>• Complete project structures</li>
                                <li>• Multiple file generation</li>
                            </ul>
                            <p className="text-sm text-purple-300 mt-3">Ask me anything about React development!</p>
                        </div>
                    </div>
                </div>

                {/* User and AI Messages */}
                {messages.map((message, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 ${message.role === 'user' ? 'bg-blue-500' :
                            message.isError ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            } rounded-full flex items-center justify-center flex-shrink-0`}>
                            {message.role === 'user' ? (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className={`rounded-lg p-4 border ${message.role === 'user' ? 'bg-blue-500/10 border-blue-500/20' :
                                message.isError ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'
                                }`}>
                                <div
                                    className="prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                                />

                                {message.role === 'assistant' && !message.isError && (
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(message.content)}
                                                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                </svg>
                                                <span>Copy</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const blob = new Blob([message.content], { type: 'text/plain' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = 'ai-response.md';
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    document.body.removeChild(a);
                                                    URL.revokeObjectURL(url);
                                                }}
                                                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                                </svg>
                                                <span>Download</span>
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatMessages;