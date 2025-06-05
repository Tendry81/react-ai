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
    let currentSection: string | null = null;
    let currentContent: string[] = [];

    const lines = content.split('\n');

    for (const line of lines) {
        // Detect Markdown headers
        const headerMatch = line.match(/^#\s+(.+)/);

        if (headerMatch) {
            // Save previous section if exists
            if (currentSection) {
                files.push({
                    name: `${currentSection}.md`,
                    path: `${currentSection.toLowerCase()}.md`,
                    type: 'file',
                    language: 'markdown',
                    content: currentContent.join('\n')
                });
                currentContent = [];
            }

            currentSection = headerMatch[1];
        } else if (currentSection) {
            currentContent.push(line);
        }
    }

    // Add the last section
    if (currentSection && currentContent.length > 0) {
        files.push({
            name: `${currentSection}.md`,
            path: `${currentSection.toLowerCase()}.md`,
            type: 'file',
            language: 'markdown',
            content: currentContent.join('\n')
        });
    }

    return files;
};