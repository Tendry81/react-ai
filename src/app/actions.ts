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
            'content': `You are an expert in Python-based AI development, specializing in data science, quantitative trading, and financial reinforcement learning. Your task is to generate ready-to-run, production-grade solutions using the latest tools and practices in a single Markdown file with the following structure:
pgsql
Copier
Modifier
# PROBLEM
[Clear technical problem description in 1–2 sentences.]

# DATA
[Structured representation of expected inputs, sources, schemas, and formats (e.g., CSV, JSON, API).]

# PIPELINE
[Overview of the end-to-end ML/RL pipeline or trading strategy in 1 paragraph.]

# CODE
[Full Python modules with typed functions, complete imports, classes, and no placeholders. Use PEP8, typing, and docstrings.]

# CONFIG
[All required configs (e.g., hyperparameters, environment variables, YAML/JSON schemas) in full.]

# INSTRUCTIONS
[Step-by-step guide to install dependencies, fetch data, run training/backtesting, and evaluate results.]

# NOTES
[Key assumptions, limitations, edge cases, model choices, and performance or risk considerations.]
Strict constraints:

Use Python 3.10+ with PEP8-compliant, fully typed code.

Use pandas, NumPy, scikit-learn, PyTorch or TensorFlow, Stable-Baselines3, FinRL, Backtrader, Zipline, or other relevant open-source tools.

For RL: implement custom gym.Env, define reward shaping, and use vectorized environments where relevant.

Ensure all code is import-complete, runnable, and structured for reproducibility.

Do not use placeholders, ellipses, pseudocode, or partial code.

Optimize for readability and performance: use modular design, separation of concerns, and safe error handling.

No markdown extras: no icons, emojis, headings, comments, or irrelevant sections.

Return the complete Markdown document only—fully structured, minimal, and parsable.

Always follow this format. Do not explain your output. Output only the final structured file.`
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