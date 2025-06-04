export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    content?: string;
    language?: string;
    children?: FileNode[];
}

export const parseCodeResponse = (content: string): FileNode[] => {
    const files: FileNode[] = [];
    const lines = content.split('\n');
    let currentFile: FileNode | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
        // Detect file headers like: // src/components/Button.tsx
        const fileMatch = line.match(/^\/\/\s*(.+\.(tsx?|jsx?|css|json|md|html))/);

        if (fileMatch) {
            // Save previous file if exists
            if (currentFile) {
                currentFile.content = currentContent.join('\n');
                files.push(currentFile);
                currentContent = [];
            }

            const fullPath = fileMatch[1];
            const pathParts = fullPath.split('/');
            const fileName = pathParts.pop() || '';
            const extension = fileName.split('.').pop() || '';

            currentFile = {
                name: fileName,
                path: fullPath,
                type: 'file',
                language: getLanguageFromExtension(extension),
            };
        } else if (currentFile) {
            currentContent.push(line);
        }
    }

    // Add the last file
    if (currentFile) {
        currentFile.content = currentContent.join('\n');
        files.push(currentFile);
    }

    // Convert flat files to tree structure
    return buildFileTree(files);
};

const getLanguageFromExtension = (ext: string): string => {
    const extensions: Record<string, string> = {
        'js': 'javascript',
        'ts': 'typescript',
        'jsx': 'javascript',
        'tsx': 'typescript',
        'css': 'css',
        'html': 'html',
        'json': 'json',
        'md': 'markdown',
    };
    return extensions[ext] || 'plaintext';
};

const buildFileTree = (files: FileNode[]): FileNode[] => {
    const root: FileNode = { name: '', path: '', type: 'directory', children: [] };

    files.forEach((file) => {
        const pathParts = file.path.split('/');
        let currentLevel = root;

        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            let found = currentLevel.children?.find((child) => child.name === part);

            if (!found) {
                found = {
                    name: part,
                    path: pathParts.slice(0, i + 1).join('/'),
                    type: 'directory',
                    children: [],
                };
                currentLevel.children?.push(found);
            }

            currentLevel = found;
        }

        currentLevel.children?.push(file);
    });

    return root.children || [];
};