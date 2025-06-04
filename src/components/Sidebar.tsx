'use client';

import { useAppContext } from '@/context/AppContext';
import React, { useState } from 'react';
import ModelSettings from './ModelSettings';
import QuickActions from './QuickActions';

const Sidebar: React.FC = () => {
    const { apiKey, setApiKey, validateApiKey } = useAppContext();
    const [apiStatus, setApiStatus] = useState('');

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
        <div className="space-y-6 w-full">
            <ModelSettings />

            <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                    API Key
                </h3>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Together.ai API key"
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={handleValidate}
                            className="px-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Validate
                        </button>
                    </div>
                    {apiStatus && (
                        <div className={`text-xs ${apiStatus.includes('valid') ? 'text-green-400' :
                                apiStatus.includes('Invalid') ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                            {apiStatus}
                        </div>
                    )}
                    <p className="text-xs text-gray-400">
                        Get your API key from <a
                            href="https://together.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 underline"
                        >
                            together.ai
                        </a>
                    </p>
                </div>
            </div>

            <QuickActions />
        </div>
    );
};

export default Sidebar;