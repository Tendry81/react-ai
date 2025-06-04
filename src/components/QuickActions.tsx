'use client';

import { useAppContext } from '@/context/AppContext';
import React from 'react';

const QuickActions: React.FC = () => {
    const { setMessageInput } = useAppContext();

    const quickPrompts = [
        {
            title: "React Component",
            prompt: "Create a React component with TypeScript and Tailwind CSS",
            icon: "📦"
        },
        {
            title: "Next.js Project",
            prompt: "Generate a complete Next.js project structure with modern best practices",
            icon: "🚀"
        },
        {
            title: "Dashboard Layout",
            prompt: "Create a responsive dashboard layout with Tailwind CSS",
            icon: "🎨"
        },
        {
            title: "Auth System",
            prompt: "Build a complete authentication system with React hooks",
            icon: "🔐"
        }
    ];

    const handleQuickPrompt = (prompt: string) => {
        setMessageInput(prompt);
    };

    return (
        <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
                {quickPrompts.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickPrompt(action.prompt)}
                        className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors flex items-center"
                    >
                        <span className="mr-2">{action.icon}</span>
                        <span>{action.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;