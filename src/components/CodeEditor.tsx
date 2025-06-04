'use client';

import { useAppContext } from '@/context/AppContext';
import * as monaco from 'monaco-editor';
import dynamic from 'next/dynamic';
import React, { useRef } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
    content: string;
    language: string;
    filePath?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, language, filePath }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const { theme } = useAppContext();

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    };

    const handleEditorWillUnmount = () => {
        editorRef.current?.dispose();
        editorRef.current = null;
    };

    return (
        <div className="h-full w-full flex flex-col">
            {filePath && (
                <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono border-b border-gray-700 flex items-center">
                    <span className="truncate">{filePath}</span>
                </div>
            )}
            <div className="flex-1">
                <MonacoEditor
                    value={content}
                    language={language}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                    onMount={handleEditorDidMount}
                    beforeMount={handleEditorWillUnmount}
                    options={{
                        minimap: { enabled: true },
                        automaticLayout: true,
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        renderWhitespace: 'all',
                        wordWrap: 'on',
                        wrappingIndent: 'indent',
                        smoothScrolling: true,
                        readOnly: false,
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        cursorStyle: 'line',
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;