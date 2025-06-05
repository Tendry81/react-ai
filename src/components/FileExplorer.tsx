'use client';

import { FileNode } from '@/types/types';
import React, { useState } from 'react';

interface FileExplorerProps {
    files: FileNode[];
    onFileSelect: (path: string) => void;
    selectedFile?: string;
}

const FileItem: React.FC<{
    node: FileNode;
    depth: number;
    onSelect: (path: string) => void;
    selectedFile?: string;
}> = ({ node, depth, onSelect, selectedFile }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        if (node.type === 'directory') {
            setExpanded(!expanded);
        } else {
            onSelect(node.path);
        }
    };

    return (
        <div className="pl-4">
            <div
                className={`flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-gray-700 rounded ${selectedFile === node.path ? 'bg-gray-600' : ''
                    }`}
                onClick={toggleExpand}
                style={{ paddingLeft: `${depth * 12}px` }}
            >
                {node.type === 'directory' ? (
                    <span className="mr-2 w-4">
                        {expanded ? '📂' : '📁'}
                    </span>
                ) : (
                    <span className="mr-2 w-4">📄</span>
                )}
                <span className="truncate">{node.name}</span>
            </div>
            {expanded && node.children && node.children.map(child => (
                <FileItem
                    key={child.path}
                    node={child}
                    depth={depth + 1}
                    onSelect={onSelect}
                    selectedFile={selectedFile}
                />
            ))}
        </div>
    );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect, selectedFile }) => {
    return (
        <div className="h-full overflow-y-auto bg-gray-900 text-gray-300 p-2 border-r border-gray-700">
            <div className="font-medium mb-2 px-2 text-purple-400">Root</div>
            {files.map(node => (
                <FileItem
                    key={node.path}
                    node={node}
                    depth={0}
                    onSelect={onFileSelect}
                    selectedFile={selectedFile}
                />
            ))}
        </div>
    );
};

export default FileExplorer;