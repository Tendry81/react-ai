'use client';

import { sendMessage } from '@/app/actions';
import { useAppContext } from '@/context/AppContext';
import { parseCodeResponse } from '@/lib/codeParser';
import { Message } from '@/types/types';
import React, { useEffect, useRef, useState } from 'react';
const InputSection: React.FC = () => {
    const [message, setMessage] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const {
        messages,
        addMessage,
        setIsTyping,
        apiKey,
        model,
        temperature,
        maxTokens,
        setFiles,
        messageInput,
        setMessageInput
    } = useAppContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const updateCharCount = () => {
        const count = message.length;
        setCharCount(count);
    };

    useEffect(() => {
        updateCharCount();
    }, [message]);

    const handleSendMessage = async () => {
        console.log("handleSendMessage")
        console.log("messageInput", messageInput)
        console.log("apiKey", apiKey)
        console.log("isSending", isSending)
        if (!messageInput.trim() || !apiKey || isSending) return;
        console.log("handleSendMessage OK")

        // Add user message
        const userMessage: Message = { role: 'user', content: messageInput };
        addMessage(userMessage);
        setMessageInput('');

        // Show typing indicator
        setIsTyping(true);
        setIsSending(true);

        try {
            // Call server action
            const result = await sendMessage({
                messages: [...messages, userMessage],
                model,
                temperature,
                maxTokens,
                apiKey
            });

            // Add assistant message
            addMessage({ role: 'assistant', content: result.content });

            // Parse files from the response
            const parsedFiles = parseCodeResponse(result.content);
            setFiles(parsedFiles);
        } catch (error) {
            console.error('Error:', error);
            addMessage({
                role: 'assistant',
                content: '❌ **Error**: Sorry, there was an error processing your request. Please check your API key and try again.',
                isError: true
            });
        } finally {
            setIsTyping(false);
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="p-6 border-t border-white/10">
            <div className="flex space-x-3">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me to create React components, build Next.js apps, or generate complete project structures..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[60px] max-h-32"
                        rows={2}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                        <span style={{
                            color: charCount > 1800 ? '#ef4444' :
                                charCount > 1500 ? '#f59e0b' : '#6b7280'
                        }}>
                            {charCount}
                        </span>/2000
                    </div>
                </div>
                <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSending ? (
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                    ) : (
                        <>
                            <span>Send</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InputSection;