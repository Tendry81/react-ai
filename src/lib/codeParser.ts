export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    content: string;
    language: string;
    children?: FileNode[];
}

const configFiles = new Set([
    'package.json',
    'tsconfig.json',
    'next.config.js',
    'tailwind.config.js',
    'tailwind.config.ts',
    '.env',
    '.gitignore',
    'README.md'
]);

function isConfigFile(path: string): boolean {
    return configFiles.has(path.split('/').pop() || '');
}

function normalizeFilePath(path: string): string {
    // Remove any leading/trailing spaces and slashes
    path = path.trim().replace(/^\/+|\/+$/g, '');

    // Convert backslashes to forward slashes
    path = path.replace(/\\/g, '/');

    // Remove any 'src/' or './' prefixes
    path = path.replace(/^(src\/|\.\/)/g, '');

    return path;
}

// Fixed parseCodeSection function
function parseCodeSection(content: string): FileNode[] {
    const codeFiles: FileNode[] = [];
    const lines = content.split('\n');

    let currentFile: string | null = null;
    let currentLanguage: string | null = null;
    let currentContent: string[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const filePathMatch = line.match(/^`([^`]+)`:\s*$/);
        const codeBlockStart = line.match(/^```(\w+)?/);
        const codeBlockEnd = line.match(/^```$/);

        if (filePathMatch && !inCodeBlock) {
            // Found a file path declaration
            currentFile = normalizeFilePath(filePathMatch[1]);
            currentLanguage = null;
            currentContent = [];
        } else if (codeBlockStart && !inCodeBlock) {
            // Start of code block
            inCodeBlock = true;
            currentLanguage = codeBlockStart[1] || null;
            currentContent = [];
        } else if (codeBlockEnd && inCodeBlock) {
            // End of code block
            inCodeBlock = false;

            if (currentFile) {
                const fileName = currentFile.split('/').pop() || currentFile;
                const language = getLanguageFromPath(currentFile) || currentLanguage || '';

                codeFiles.push({
                    name: fileName,
                    path: currentFile,
                    type: 'file',
                    language,
                    content: currentContent.join('\n')
                });
            }

            // Reset for next file
            currentFile = null;
            currentLanguage = null;
            currentContent = [];
        } else if (inCodeBlock) {
            // Inside code block - collect content
            currentContent.push(line);
        }
    }

    // Handle case where code block doesn't end properly
    if (inCodeBlock && currentFile && currentContent.length > 0) {
        const fileName = currentFile.split('/').pop() || currentFile;
        const language = getLanguageFromPath(currentFile) || currentLanguage || '';

        codeFiles.push({
            name: fileName,
            path: currentFile,
            type: 'file',
            language,
            content: currentContent.join('\n')
        });
    }

    return codeFiles;
}

export const parseCodeResponse = (content: string): FileNode[] => {
    const files: FileNode[] = [];
    const lines = content.split('\n');

    let currentSection: string | null = null;
    let currentContent: string[] = [];
    let inCodeBlock = false;
    let currentFile: string | null = null;
    let codeBlockLanguage: string | null = null;
    let codeBlockContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect Markdown headers
        const headerMatch = line.match(/^#\s+(.+)/);

        // Detect code blocks with file paths (e.g., `app/layout.tsx`:)
        const filePathMatch = line.match(/^`([^`]+)`:\s*$/);

        // Detect code block start/end
        const codeBlockStart = line.match(/^```(\w+)?/);
        const codeBlockEnd = line.match(/^```$/);

        if (headerMatch && !inCodeBlock) {
            // Save previous section if exists
            if (currentSection && currentContent.length > 0) {
                console.log('Processing section:', currentSection);

                if (currentSection.trim().toUpperCase() === 'CODE') {
                    // Parse CODE section content and add resulting files
                    const codeFiles = parseCodeSection(currentContent.join('\n'));
                    console.log('Found code files:', codeFiles.length);
                    files.push(...codeFiles);
                } else {
                    // Regular markdown section
                    files.push({
                        name: `${currentSection}.md`,
                        path: `${currentSection.toLowerCase().replace(/\s+/g, '-')}.md`,
                        type: 'file',
                        language: 'markdown',
                        content: currentContent.join('\n').trim()
                    });
                }
            }

            // Start new section
            currentSection = headerMatch[1];
            currentContent = [];
        }
        else if (filePathMatch && !inCodeBlock && !currentSection) {
            // Handle standalone file path declarations (not in a section)
            currentFile = normalizeFilePath(filePathMatch[1]);
            if (isConfigFile(currentFile)) {
                currentFile = currentFile.split('/').pop() || currentFile;
            }
        }
        else if (codeBlockStart && !inCodeBlock && !currentSection) {
            // Standalone code block (not in a section)
            inCodeBlock = true;
            codeBlockLanguage = codeBlockStart[1] || null;
            codeBlockContent = [];
        }
        else if (codeBlockEnd && inCodeBlock && !currentSection) {
            // End of standalone code block
            inCodeBlock = false;

            if (currentFile) {
                const fileName = currentFile.split('/').pop() || currentFile;
                const language = getLanguageFromPath(currentFile) || codeBlockLanguage || '';

                files.push({
                    name: fileName,
                    path: currentFile,
                    type: 'file',
                    language: language,
                    content: codeBlockContent.join('\n')
                });

                currentFile = null;
            }

            codeBlockContent = [];
            codeBlockLanguage = null;
        }
        else if (inCodeBlock && !currentSection) {
            // Inside standalone code block
            codeBlockContent.push(line);
        }
        else if (currentSection) {
            // Regular content in a section (including file paths and code blocks)
            currentContent.push(line);
        }
    }

    // Handle any remaining content
    if (currentSection && currentContent.length > 0) {
        console.log('Processing final section:', currentSection);

        if (currentSection.trim().toUpperCase() === 'CODE') {
            const codeFiles = parseCodeSection(currentContent.join('\n'));
            console.log('Found final code files:', codeFiles.length);
            files.push(...codeFiles);
        } else {
            files.push({
                name: `${currentSection}.md`,
                path: `${currentSection.toLowerCase().replace(/\s+/g, '-')}.md`,
                type: 'file',
                language: 'markdown',
                content: currentContent.join('\n').trim()
            });
        }
    }

    // Handle case where we're still in a standalone code block at the end
    if (inCodeBlock && currentFile && codeBlockContent.length > 0) {
        const fileName = currentFile.split('/').pop() || currentFile;
        const language = getLanguageFromPath(currentFile) || codeBlockLanguage || '';

        files.push({
            name: fileName,
            path: currentFile,
            type: 'file',
            language: language,
            content: codeBlockContent.join('\n')
        });
    }

    console.log('Total files parsed:', files.length);

    // After all files are processed, organize them in a tree structure
    return organizeFilesInTree(files);
};

// Helper function to determine language from file extension
function getLanguageFromPath(filePath: string): string | undefined {
    const extension = filePath.split('.').pop()?.toLowerCase();

    const languageMap: Record<string, string> = {
        'ts': 'typescript',
        'tsx': 'typescript',
        'js': 'javascript',
        'jsx': 'javascript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'cs': 'csharp',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'scala': 'scala',
        'sh': 'bash',
        'bash': 'bash',
        'zsh': 'zsh',
        'fish': 'fish',
        'ps1': 'powershell',
        'html': 'html',
        'htm': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'less': 'less',
        'json': 'json',
        'xml': 'xml',
        'yaml': 'yaml',
        'yml': 'yaml',
        'toml': 'toml',
        'ini': 'ini',
        'cfg': 'ini',
        'conf': 'ini',
        'md': 'markdown',
        'markdown': 'markdown',
        'txt': 'text',
        'sql': 'sql',
        'r': 'r',
        'R': 'r',
        'matlab': 'matlab',
        'm': 'matlab',
        'vue': 'vue',
        'svelte': 'svelte',
        'dockerfile': 'dockerfile',
        'makefile': 'makefile'
    };

    return extension ? languageMap[extension] : undefined;
}

interface FileTree {
    [key: string]: FileNode;
}

function organizeFilesInTree(files: FileNode[]): FileNode[] {
    const tree: FileTree = {};
    const root: FileNode[] = [];

    // First pass: create all file nodes
    files.forEach(file => {
        const parts = file.path.split('/');
        const fileName = parts.pop() || '';

        if (parts.length === 0) {
            root.push(file);
            tree[file.path] = file;
            return;
        }

        // Create directory nodes if they don't exist
        let currentPath = '';
        parts.forEach(part => {
            const parentPath = currentPath;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!tree[currentPath]) {
                const dirNode: FileNode = {
                    name: part,
                    path: currentPath,
                    type: 'directory',
                    content: '',
                    language: '',
                    children: []
                };
                tree[currentPath] = dirNode;

                if (parentPath) {
                    tree[parentPath].children = tree[parentPath].children || [];
                    tree[parentPath].children.push(dirNode);
                } else {
                    root.push(dirNode);
                }
            }
        });

        // Add file to its parent directory
        const parentPath = parts.join('/');
        if (parentPath) {
            tree[parentPath].children = tree[parentPath].children || [];
            tree[parentPath].children.push(file);
        } else {
            root.push(file);
        }

        tree[file.path] = file;
    });

    return root;
}