'use client';

import { useAppContext } from '@/context/AppContext';
import React from 'react';

const ModelSettings: React.FC = () => {
    const {
        model,
        setModel,
        temperature,
        setTemperature,
        maxTokens,
        setMaxTokens
    } = useAppContext();

    return (
        <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Model Settings
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="meta-llama/Llama-3.1-70B-Instruct-Turbo">Llama 3.1 70B (Recommended)</option>
                        <option value="meta-llama/Llama-3.1-8B-Instruct-Turbo">Llama 3.1 8B (Fast)</option>
                        <option value="mistralai/Mixtral-8x7B-Instruct-v0.1">Mixtral 8x7B</option>
                        <option value="codellama/CodeLlama-34b-Instruct-hf">CodeLlama 34B</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Temperature: <span className="text-purple-300">{temperature}</span></label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens: <span className="text-purple-300">{maxTokens}</span></label>
                    <input
                        type="range"
                        min="256"
                        max="4096"
                        step="256"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Short</span>
                        <span>Medium</span>
                        <span>Long</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelSettings;