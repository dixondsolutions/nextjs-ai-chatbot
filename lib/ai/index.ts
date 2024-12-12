import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  console.log('Routing model request for:', apiIdentifier);
  
  if (apiIdentifier === 'claude-3-5-sonnet-20241022') {
    console.log('Using Claude 3.5 Sonnet model');
    return wrapLanguageModel({
      model: anthropic(apiIdentifier),
      middleware: customMiddleware,
    });
  }
  
  console.log('Using OpenAI model:', apiIdentifier);
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  });
};
