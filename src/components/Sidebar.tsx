'use client';

import { useAppContext } from '@/context/AppContext';
import { Settings } from 'lucide-react'; // Add this import
import React, { useState } from 'react';
import ModelSettings from './ModelSettings';

const Sidebar: React.FC = ({ children }: { children: React.ReactNode }) => {
    const { apiKey, setApiKey, validateApiKey } = useAppContext();
    const [apiStatus, setApiStatus] = useState('');
    const [showModelSettings, setShowModelSettings] = useState(false); // Add this state

    const handleValidate = async () => {
        setApiStatus('Validating...');
        try {
            await validateApiKey();
            setApiStatus('API key valid!');
        } catch (error) {
            setApiStatus('Invalid API key');
        }
        setTimeout(() => setApiStatus(''), 3000);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6 w-full">
                {children}
            </div>

            {/* Model Settings Button */}
            <button
                onClick={() => setShowModelSettings(true)}
                className="w-full mt-4 p-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-b-lg transition-colors"
            >
                <Settings className="w-4 h-4" />
                <span>Model Settings</span>
            </button>

            {/* Model Settings Modal */}
            {showModelSettings && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-gray-900 rounded-xl border border-white/10 p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Model Settings</h3>
                            <button
                                onClick={() => setShowModelSettings(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <ModelSettings />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;