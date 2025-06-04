'use client';

import { getAvailableModels, validateApi } from '@/app/actions';
import { FileNode, Message, TogetherModel } from '@/types/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppContextType {
    messages: Message[];
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    isTyping: boolean;
    setIsTyping: (isTyping: boolean) => void;
    settingsOpen: boolean;
    toggleSettings: () => void;
    apiKey: string;
    setApiKey: (key: string) => void;
    model: string;
    setModel: (model: string) => void;
    temperature: number;
    setTemperature: (temp: number) => void;
    maxTokens: number;
    setMaxTokens: (tokens: number) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    files: FileNode[];
    setFiles: (files: FileNode[]) => void;
    validateApiKey: () => Promise<void>;
    messageInput: string;
    setMessageInput: (input: string) => void;
    apiStatus: string;
    setApiStatus: (status: string) => void;
    availableModels: TogetherModel[];
    setAvailableModels: (models: TogetherModel[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{
    children: React.ReactNode;
    setFiles?: (files: FileNode[]) => void;
}> = ({ children, setFiles: propSetFiles }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [files, setFilesState] = useState<FileNode[]>([]);
    const [apiStatus, setApiStatus] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [availableModels, setAvailableModels] = useState<TogetherModel[]>([]);

    const setFiles = (files: FileNode[]) => {
        setFilesState(files);
        if (propSetFiles) {
            propSetFiles(files);
        }
    };

    useEffect(() => {
        // Load saved messages and settings from localStorage
        const savedMessages = localStorage.getItem('chat_messages');
        const savedApiKey = localStorage.getItem('together_api_key');
        const savedModel = localStorage.getItem('selected_model');
        const savedTemp = localStorage.getItem('temperature');
        const savedTokens = localStorage.getItem('max_tokens');
        const savedTheme = localStorage.getItem('theme');

        if (savedMessages) setMessages(JSON.parse(savedMessages));
        if (savedApiKey) setApiKey(savedApiKey);
        if (savedModel) setModel(savedModel);
        if (savedTemp) setTemperature(parseFloat(savedTemp));
        if (savedTokens) setMaxTokens(parseInt(savedTokens));
        if (savedTheme) setTheme(savedTheme as 'light' | 'dark');
    }, []);

    const addMessage = (message: Message) => {
        setMessages(prev => {
            const newMessages = [...prev, message];
            localStorage.setItem('chat_messages', JSON.stringify(newMessages));
            return newMessages;
        });
    };

    const clearMessages = () => {
        setMessages([]);
        setFiles([]);
        localStorage.removeItem('chat_messages');
    };

    const toggleSettings = () => {
        setSettingsOpen(prev => !prev);
    };

    const validateApiKeyContext = async () => {
        if (!apiKey) {
            setApiStatus('No API key provided');
            return;
        }

        try {
            setApiStatus('Validating...');
            const isValid = await validateApi(apiKey);
            setApiStatus(isValid ? 'API key valid' : 'Invalid API key');
        } catch (error) {
            setApiStatus('Failed to validate API key');
        }

        // Clear status after 3 seconds
        //setTimeout(() => setApiStatus(''), 3000);
    };

    // Save settings when they change
    useEffect(() => {
        localStorage.setItem('together_api_key', apiKey);
        if (apiKey) validateApiKeyContext();
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('selected_model', model);
    }, [model]);

    useEffect(() => {
        localStorage.setItem('temperature', temperature.toString());
    }, [temperature]);

    useEffect(() => {
        localStorage.setItem('max_tokens', maxTokens.toString());
    }, [maxTokens]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        const fetchModels = async () => {
            if (apiKey && apiStatus === 'API key valid') {
                try {
                    const response = await getAvailableModels(apiKey);
                    const modelNames = response.data.map((model: any) => model.id);
                    setAvailableModels(modelNames);
                } catch (error) {
                    console.error('Error fetching models:', error);
                }
            }
        };
        fetchModels();
    }, [apiKey, apiStatus]);

    return (
        <AppContext.Provider value={{
            messages,
            addMessage,
            clearMessages,
            isTyping,
            setIsTyping,
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
            files,
            setFiles,
            validateApiKey: validateApiKeyContext,
            messageInput,
            setMessageInput,
            apiStatus,
            setApiStatus,
            availableModels,
            setAvailableModels,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};