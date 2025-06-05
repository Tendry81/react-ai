'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Folder, MessageSquare, Terminal } from 'lucide-react';
import { Resizable } from 're-resizable';
import { useRef, useState } from 'react';

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    chat?: React.ReactNode;
    console?: React.ReactNode;
}

export const WorkspaceLayout = ({
    children,
    sidebar,
    chat,
    console: consoleContent
}: WorkspaceLayoutProps) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);
    const [isConsoleVisible, setIsConsoleVisible] = useState(true);
    const mainContentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="h-screen flex flex-col bg-gray-950">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Section */}
                <Resizable
                    enable={{ right: !isSidebarCollapsed }}
                    minWidth={isSidebarCollapsed ? 48 : 200}
                    maxWidth={400}
                    defaultSize={{ width: isSidebarCollapsed ? 48 : 240, height: '100%' }}
                    className="flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ease-in-out"
                >
                    <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-800/50">
                        {!isSidebarCollapsed && (
                            <div className="flex items-center gap-2 text-gray-300">
                                <Folder className="w-4 h-4" />
                                <span className="text-sm font-medium">Explorer</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                        >
                            {isSidebarCollapsed ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                <ChevronLeft className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <div className={`flex-1 overflow-hidden ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                        {sidebar}
                    </div>
                    {isSidebarCollapsed && (
                        <div className="flex-1 flex items-center justify-center">
                            <Folder className="w-6 h-6 text-gray-500" />
                        </div>
                    )}
                </Resizable>

                {/* Main Content Area with Editor and Console */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Editor Section */}
                    <div className="flex-1 overflow-hidden bg-gray-900">
                        <div ref={mainContentRef} className="h-full overflow-auto">
                            {children}
                        </div>
                    </div>

                    {/* Console Section */}
                    {isConsoleVisible && (
                        <Resizable
                            enable={{ top: true }}
                            defaultSize={{ width: '100%', height: '30%' }}
                            minHeight={100}
                            maxHeight="50%"
                            className="border-t border-gray-800 bg-gray-900"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-2 bg-gray-800/50 border-b border-gray-700">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Terminal className="w-4 h-4" />
                                        <span className="text-sm">Console</span>
                                    </div>
                                    <button
                                        onClick={() => setIsConsoleVisible(false)}
                                        className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-auto p-4">
                                    {consoleContent}
                                </div>
                            </div>
                        </Resizable>
                    )}

                    {/* Console Toggle Button (when console is hidden) */}
                    {!isConsoleVisible && (
                        <button
                            onClick={() => setIsConsoleVisible(true)}
                            className="absolute bottom-0 right-[320px] m-2 p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                        >
                            <Terminal className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Chat Section */}
                <Resizable
                    enable={{ left: !isChatCollapsed }}
                    minWidth={isChatCollapsed ? 48 : 280}
                    maxWidth={500}
                    defaultSize={{ width: isChatCollapsed ? 48 : 320, height: '100%' }}
                    className="border-l border-gray-800 bg-gray-900 transition-all duration-300 ease-in-out"
                >
                    <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-800/50">
                        {!isChatCollapsed && (
                            <div className="flex items-center gap-2 text-gray-300">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium">Chat</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsChatCollapsed(!isChatCollapsed)}
                            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                        >
                            {isChatCollapsed ? (
                                <ChevronLeft className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {!isChatCollapsed && (
                        <div className="flex flex-col h-[calc(100%-48px)]">
                            {chat}
                        </div>
                    )}
                    {isChatCollapsed && (
                        <div className="flex-1 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-gray-500" />
                        </div>
                    )}
                </Resizable>
            </div>
        </div>
    );
};

export default WorkspaceLayout;