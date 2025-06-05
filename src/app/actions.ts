'use server';

import { Message } from '@/types/types';
import Together from 'together-ai';
import { ModelListResponse } from 'together-ai/src/resources.js';

export const sendMessage = async (data: {
    messages: Message[];
    model: string;
    temperature: number;
    maxTokens: number;
    apiKey: string;
}): Promise<{ content: string }> => {
    try {
        const together = new Together({
            apiKey: data.apiKey,
        });
        console.log('Sending message to Together', data)
        data.messages.push({
            'role': 'system',
            'content': `You are a senior developer specialized *exclusively* in React 18+ and Next.js 14+ using the App Router. Your task is to generate a **fully functional, production-grade solution** strictly formatted in a single Markdown file. Adhere to the following structure and constraints:
            # SOLUTION
            [Concise technical overview in one paragraph.]
            # ARCHITECTURE
            [Minimal ASCII tree of all files and folders.]
            # CODE
            [Fully typed TypeScript files with complete imports, no omissions, all functional, ready to run.]
            # CONFIGURATION
            [All necessary full-length config files (e.g., tsconfig.json, tailwind.config.ts, next.config.js).]
            # INSTRUCTIONS
            [Exact steps to set up, run, and test the project.]
            # NOTES
            [Key implementation choices, technical constraints, or performance notes.]

            **Strict requirements:**
            * Use **functional components only** with React hooks.
            * Use **Tailwind CSS**, **React Hook Form**, **Zod**, **Server Actions**, and **App Router**.
            * Use **prisma** only for **database integration** is needed.
            * All code must be **strictly typed**, import-complete, **error-handled**, and follow **performance best practices** (e.g., memoization, dynamic imports, suspense boundaries).
            * Group imports logically and avoid unused ones.
            * Avoid class components, icons, emojis, headings, bullet points, comments, or extra markdown outside the required sections.
            * Render everything inline; content must be compact, single-line per element when possible.
            * Do not return partial, placeholder, or JavaScript code. TypeScript only.
            * Ensure output is Markdown-parsable and optimized for rendering speed.
            You must always return the full response in the format above—nothing more, nothing less.
`
        })
        const response = await together.chat.completions.create({
            model: data.model,
            messages: data.messages,
            temperature: data.temperature,
            max_tokens: data.maxTokens,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content received from API');
        }

        return { content };
    } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
    }
};

export const validateApi = async (apiKey: string): Promise<boolean> => {
    try {
        const together = new Together({
            apiKey: apiKey,
        });
        console.log('Validating API key with Together');
        // Test the API key by fetching models
        await together.models.list();
        console.log('Validating API key with Together end');
        return true;
    } catch (error) {
        console.error('Error validating API key:', error);
        return false;
    }
};

interface TogetherModel {
    id: string;
    name: string;
    object: string;
    created: number;
    owned_by: string;
}

export const getAvailableModels = async (apiKey: string): Promise<{ data: TogetherModel[] }> => {
    try {
        const together = new Together({
            apiKey: apiKey,
        });

        const response = await together.models.list();

        // Filter for free models (all pricing values are 0)
        const freeModels = response.filter((model: ModelListResponse) => {
            const { pricing } = model;
            if (!pricing) return true;
            return (
                pricing.hourly === 0 &&
                pricing.input === 0 &&
                pricing.output === 0 &&
                pricing.base === 0 &&
                pricing.finetune === 0
            );
        });

        return { data: freeModels };
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
};