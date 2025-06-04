'use client';

import React from 'react';

interface FileTabsProps {
    openFiles: string[];
    activeFile: string;
    onTabClick: (path: string) => void;
    onTabClose: (path: string) => void;
}

const FileTabs: React.FC<FileTabsProps> = ({ openFiles, activeFile, onTabClick, onTabClose }) => {
    return (
        <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
            {openFiles.map((path) => (
                <div
                    key={path}
                    className={`flex items-center py-2 px-3 text-sm cursor-pointer border-r border-gray-700 ${activeFile === path
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        }`}
                >
                    <span
                        className="truncate max-w-xs pr-2"
                        onClick={() => onTabClick(path)}
                    >
                        {path.split('/').pop()}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTabClose(path);
                        }}
                        className="text-gray-500 hover:text-white rounded-full hover:bg-gray-600 w-5 h-5 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FileTabs;