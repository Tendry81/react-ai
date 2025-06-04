'use client';

import ChatMessages from '@/components/ChatMessages';
import CodeEditor from '@/components/CodeEditor';
import FileExplorer from '@/components/FileExplorer';
import FileTabs from '@/components/FileTabs';
import Header from '@/components/Header';
import InputSection from '@/components/InputSection';
import MonacoLoader from '@/components/MonacoLoader';
import SettingsModal from '@/components/SettingsModal';
import { AppProvider } from '@/context/AppContext';
import { FileNode } from '@/types/types';
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
    if (!openFiles.includes(path)) {
      setOpenFiles([...openFiles, path]);
    }
  };

  const handleTabClick = (path: string) => {
    setActiveFile(path);
  };

  const handleTabClose = (path: string) => {
    setOpenFiles(openFiles.filter(file => file !== path));
    if (activeFile === path) {
      setActiveFile(openFiles.length > 1 ? openFiles[0] : '');
    }
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
      <div id="app" className="min-h-screen flex flex-col bg-gray-950">
        <MonacoLoader />
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* Left File Explorer Panel */}
          <div
            className={`
              ${isFileExplorerCollapsed ? 'w-12' : 'w-64'} 
              transition-all duration-300 ease-in-out
              flex-shrink-0 border-r border-gray-800 flex flex-col bg-gray-900
              relative group
            `}
          >
            {/* File Explorer Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-800/50">
              {!isFileExplorerCollapsed && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm font-medium">Explorer</span>
                </div>
              )}
              <button
                onClick={() => setIsFileExplorerCollapsed(!isFileExplorerCollapsed)}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                title={isFileExplorerCollapsed ? 'Expand Explorer' : 'Collapse Explorer'}
              >
                {isFileExplorerCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* File Explorer Content */}
            <div className={`flex-1 overflow-hidden ${isFileExplorerCollapsed ? 'hidden' : 'block'}`}>
              <FileExplorer
                files={files}
                onFileSelect={handleFileSelect}
                selectedFile={activeFile}
              />
            </div>

            {/* Collapsed State Indicator */}
            {isFileExplorerCollapsed && (
              <div className="flex-1 flex items-center justify-center opacity-50">
                <Folder className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Section */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
              {/* File Tabs */}
              {openFiles.length > 0 && (
                <div className="border-b border-gray-800">
                  <FileTabs
                    openFiles={openFiles}
                    activeFile={activeFile}
                    onTabClick={handleTabClick}
                    onTabClose={handleTabClose}
                  />
                </div>
              )}

              {/* Code Editor */}
              <div className="flex-1 overflow-hidden">
                {activeFile ? (
                  <CodeEditor
                    content={getFileContent(activeFile).content}
                    language={getFileContent(activeFile).language}
                    filePath={activeFile}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 bg-gray-900">
                    <div className="text-center">
                      <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium mb-1">No file selected</p>
                      <p className="text-sm opacity-75">Select a file from the explorer to view or edit</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Chat Panel */}
            <div
              className={`
                ${isChatCollapsed ? 'w-12' : 'w-80'} 
                transition-all duration-300 ease-in-out
                border-l border-gray-800 flex flex-col bg-gray-900
                relative
              `}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-800/50">
                {!isChatCollapsed && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">Chat</span>
                  </div>
                )}
                <button
                  onClick={() => setIsChatCollapsed(!isChatCollapsed)}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors ml-auto"
                  title={isChatCollapsed ? 'Expand Chat' : 'Collapse Chat'}
                >
                  {isChatCollapsed ? (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Chat Content */}
              {!isChatCollapsed && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-hidden">
                    <ChatMessages />
                  </div>
                  <div className="border-t border-gray-800">
                    <InputSection />
                  </div>
                </div>
              )}

              {/* Collapsed State Indicator */}
              {isChatCollapsed && (
                <div className="flex-1 flex items-center justify-center opacity-50">
                  <MessageSquare className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </div>
          </div>
        </div>
        <SettingsModal />
      </div>
    </AppProvider>
  );
}