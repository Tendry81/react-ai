// src/lib/formattingUtils.ts
export const formatMessageContent = (content: string): string => {
    // Replace markdown bold syntax
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace markdown italic syntax
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Replace inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-black/30 px-1 py-0.5 rounded text-sm">$1</code>');

    // Replace code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        const language = lang || 'javascript';
        return `
      <div class="my-4">
        <div class="flex items-center justify-between bg-black/50 px-4 py-2 rounded-t-lg border-b border-white/10">
          <span class="text-xs text-gray-400 uppercase font-medium">${language}</span>
          <button class="text-xs text-gray-400 hover:text-white flex items-center space-x-1 transition-colors copy-code">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre class="bg-black/50 p-4 rounded-b-lg overflow-x-auto"><code class="text-sm text-gray-300">${escapeHtml(code.trim())}</code></pre>
      </div>
    `;
    });

    // Format file headers
    formatted = formatted.replace(/^\/\/ (.+\.(tsx?|jsx?|css|json|md))$/gm,
        '<div class="bg-purple-500/20 px-3 py-2 rounded-lg border border-purple-500/30 my-3"><span class="text-purple-300 font-medium">📁 $1</span></div>'
    );

    // Replace newlines with <br>
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
};

const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};