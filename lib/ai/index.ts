import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  console.log('[AI Router] Received request for model:', apiIdentifier);
  
  // Exact match for Claude 3.5 Sonnet
  if (apiIdentifier === 'claude-3-5-sonnet-20241022') {
    console.log('[AI Router] Routing to Anthropic Claude 3.5 Sonnet');
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[AI Router] ANTHROPIC_API_KEY is not set');
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    try {
      const model = anthropic(apiIdentifier);
      console.log('[AI Router] Successfully initialized Anthropic model');
      return wrapLanguageModel({
        model,
        middleware: customMiddleware,
      });
    } catch (error) {
      console.error('[AI Router] Error initializing Anthropic model:', error);
      throw error;
    }
  }
  
  console.log('[AI Router] Defaulting to OpenAI model:', apiIdentifier);
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};
