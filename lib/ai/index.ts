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
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    return wrapLanguageModel({
      model: anthropic(apiIdentifier),
      middleware: customMiddleware,
    });
  }
  
  console.log('[AI Router] Defaulting to OpenAI model:', apiIdentifier);
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};
