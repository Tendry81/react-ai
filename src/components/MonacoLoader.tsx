'use client';

import loader from '@monaco-editor/loader';
import React, { useEffect } from 'react';

const MonacoLoader: React.FC = () => {
    useEffect(() => {
        loader.init().then((monaco) => {
            // Register additional languages if needed
            monaco.languages.register({ id: 'typescript' });
            monaco.languages.register({ id: 'javascript' });
            monaco.languages.register({ id: 'css' });
            monaco.languages.register({ id: 'html' });
            monaco.languages.register({ id: 'json' });
        });
    }, []);

    return null;
};

export default MonacoLoader;