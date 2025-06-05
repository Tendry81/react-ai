'use client';

import ChatMessages from '@/components/ChatMessages';
import CodeEditor from '@/components/CodeEditor';
import Console from '@/components/Console/Console';
import FileExplorer from '@/components/FileExplorer';
import InputSection from '@/components/InputSection';
import SettingsModal from '@/components/SettingsModal';
import WorkspaceLayout from '@/components/Workspace/WorkspaceLayout';
import { AppProvider } from '@/context/AppContext';
import { FileNode } from '@/types/types';
import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
  };

  const getFileContent = (path: string): { content: string; language: string } => {
    const findFile = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.path === path) return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const file = findFile(files);
    return {
      content: file?.content || '',
      language: file?.language || 'plaintext',
    };
  };

  return (
    <AppProvider setFiles={setFiles}>
      <WorkspaceLayout
        sidebar={
          <FileExplorer
            files={files}
            onFileSelect={handleFileSelect}
            selectedFile={activeFile}
          />
        }
        chat={
          <>
            <div className="flex-1 overflow-hidden">
              <ChatMessages />
            </div>
            <InputSection />
          </>
        }
        console={<Console />}
      >
        {activeFile ? (
          <CodeEditor
            content={getFileContent(activeFile).content}
            language={getFileContent(activeFile).language}
            filePath={activeFile}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-1">No file selected</p>
              <p className="text-sm opacity-75">
                Select a file from the explorer to view or edit
              </p>
            </div>
          </div>
        )}
      </WorkspaceLayout>
      <SettingsModal />
    </AppProvider>
  );
}