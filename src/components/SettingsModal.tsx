'use client';

import { useAppContext } from '@/context/AppContext';
import React from 'react';

const SettingsModal: React.FC = () => {
    const {
        settingsOpen,
        toggleSettings,
        apiKey,
        setApiKey,
        model,
        setModel,
        temperature,
        setTemperature,
        maxTokens,
        setMaxTokens,
        theme,
        setTheme,
        validateApiKey,
        apiStatus,
        availableModels,
    } = useAppContext();


    const handleValidateApiKey = async () => {
        await validateApiKey();
    };
    console.log("apiStatus ====> ", apiStatus)
    if (!settingsOpen) return null;

    const renderModelOptions = () => {
        if (availableModels.length === 0) {
            return (
                <>
                    <option value="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free">Meta Llama 3.3 70B Instruct Turbo Free (Recommended)</option>
                </>
            );
        }

        return availableModels.map((modelName) => {
            const modelInfo = availableModels.find((m: any) => m.id === modelName);
            const displayName = modelInfo?.display_name || modelName;
            const organization = modelInfo?.organization ? ` (${modelInfo.organization})` : '';

            return (
                <option key={modelName} value={modelName}>
                    {displayName} {organization}
                </option>
            );
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-slate-800 rounded-xl border border-white/10 p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Settings</h3>
                    <button onClick={toggleSettings} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        >
                            {renderModelOptions()}
                        </select>
                        {availableModels.length === 0 && apiKey && (
                            <p className="text-xs text-gray-400 mt-1">
                                Enter and validate your API key to see available models
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Temperature: <span>{temperature}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Tokens: <span>{maxTokens}</span>
                        </label>
                        <input
                            type="range"
                            min="256"
                            max="4096"
                            step="256"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                        <div className="flex space-x-2">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Together.ai API key"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                            />
                            <button
                                onClick={handleValidateApiKey}
                                className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                Validate
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Get your API key from{' '}
                            <a href="https://together.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                                together.ai
                            </a>
                        </p>
                        {apiStatus && (
                            <p className={`text-xs mt-1 ${apiStatus == 'API key valid' ? 'text-green-400' :
                                apiStatus == 'Invalid API key' ? 'text-red-400' : 'text-yellow-400'
                                }`}>
                                {apiStatus}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;