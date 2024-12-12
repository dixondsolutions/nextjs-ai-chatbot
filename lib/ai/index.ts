import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';
import { getSystemPrompt } from './prompts';

// Initialize clients outside of the function for better reuse
const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const customModel = (apiIdentifier: string) => {
  console.log('[AI Router] Received request for model:', apiIdentifier);
  
  // Check if it's an Anthropic model
  if (apiIdentifier.startsWith('claude')) {
    console.log('[AI Router] Routing to Anthropic');
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[AI Router] ANTHROPIC_API_KEY is not set');
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    return wrapLanguageModel({
      model: {
        invoke: async ({ messages, system }) => {
          try {
            const response = await anthropicClient.messages.create({
              model: apiIdentifier,
              messages: messages.map(m => ({
                role: m.role,
                content: m.content
              })),
              system: system || getSystemPrompt('anthropic'),
              max_tokens: 4096,
            });
            return response.content[0].text;
          } catch (error) {
            console.error('[AI Router] Anthropic API error:', error);
            throw error;
          }
        }
      },
      middleware: customMiddleware,
    });
  }
  
  // Default to OpenAI
  console.log('[AI Router] Routing to OpenAI');
  return wrapLanguageModel({
    model: {
      invoke: async ({ messages, system }) => {
        try {
          const response = await openaiClient.chat.completions.create({
            model: apiIdentifier,
            messages: [
              system ? { role: 'system', content: system } : null,
              ...messages.map(m => ({
                role: m.role,
                content: m.content
              }))
            ].filter(Boolean),
          });
          return response.choices[0].message.content || '';
        } catch (error) {
          console.error('[AI Router] OpenAI API error:', error);
          throw error;
        }
      }
    },
    middleware: customMiddleware,
  });
};
