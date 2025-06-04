export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    isError?: boolean;
}

export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    content?: string;
    language?: string;
    children?: FileNode[];
}

export interface ModelConfig {
    chat_template: string | null;
    stop: string[];
    bos_token: string | null;
    eos_token: string | null;
}

export interface ModelPricing {
    hourly: number;
    input: number;
    output: number;
    base: number;
    finetune: number;
}

export interface TogetherModel {
    id: string;
    object: string;
    created: number;
    type: string;
    running: boolean;
    display_name: string;
    organization: string;
    link: string;
    config: ModelConfig;
    pricing: ModelPricing;
}