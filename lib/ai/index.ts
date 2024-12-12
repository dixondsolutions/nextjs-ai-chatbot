import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import type { Message, LanguageModelV1, LanguageModelV1CallOptions, LanguageModelV1StreamPart } from 'ai';

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

    const model: LanguageModelV1 = {
      specificationVersion: 'v1',
      provider: 'anthropic',
      modelId: apiIdentifier,
      defaultObjectGenerationMode: 'json',
      doGenerate: async (options: LanguageModelV1CallOptions) => {
        try {
          const prompt = options.prompt || '';
          const response = await anthropicClient.messages.create({
            model: apiIdentifier,
            messages: [{ role: 'user', content: prompt.toString() }],
            max_tokens: 4096,
          });
          return {
            text: response.content[0].text,
            finishReason: 'stop',
            usage: {
              promptTokens: 0,
              completionTokens: 0,
              totalTokens: 0
            },
            rawCall: {
              rawPrompt: prompt,
              rawSettings: {}
            }
          };
        } catch (error) {
          console.error('[AI Router] Anthropic API error:', error);
          throw error;
        }
      },
      doStream: async (options: LanguageModelV1CallOptions) => {
        try {
          const prompt = options.prompt || '';
          const response = await anthropicClient.messages.create({
            model: apiIdentifier,
            messages: [{ role: 'user', content: prompt.toString() }],
            max_tokens: 4096,
            stream: true,
          });
          
          return {
            stream: response as unknown as ReadableStream<LanguageModelV1StreamPart>,
            rawCall: {
              rawPrompt: prompt,
              rawSettings: {}
            }
          };
        } catch (error) {
          console.error('[AI Router] Anthropic API error:', error);
          throw error;
        }
      }
    };

    return wrapLanguageModel({
      model,
      middleware: customMiddleware,
    });
  }
  
  // Default to OpenAI
  console.log('[AI Router] Routing to OpenAI');
  const model: LanguageModelV1 = {
    specificationVersion: 'v1',
    provider: 'openai',
    modelId: apiIdentifier,
    defaultObjectGenerationMode: 'json',
    doGenerate: async (options: LanguageModelV1CallOptions) => {
      try {
        const prompt = options.prompt || '';
        const response = await openaiClient.chat.completions.create({
          model: apiIdentifier,
          messages: [{ role: 'user', content: prompt.toString() }],
        });
        return {
          text: response.choices[0].message.content || '',
          finishReason: response.choices[0].finish_reason as 'stop',
          usage: {
            promptTokens: response.usage?.prompt_tokens || 0,
            completionTokens: response.usage?.completion_tokens || 0,
            totalTokens: response.usage?.total_tokens || 0
          },
          rawCall: {
            rawPrompt: prompt,
            rawSettings: {}
          }
        };
      } catch (error) {
        console.error('[AI Router] OpenAI API error:', error);
        throw error;
      }
    },
    doStream: async (options: LanguageModelV1CallOptions) => {
      try {
        const prompt = options.prompt || '';
        const response = await openaiClient.chat.completions.create({
          model: apiIdentifier,
          messages: [{ role: 'user', content: prompt.toString() }],
          stream: true,
        });
        
        return {
          stream: response as unknown as ReadableStream<LanguageModelV1StreamPart>,
          rawCall: {
            rawPrompt: prompt,
            rawSettings: {}
          }
        };
      } catch (error) {
        console.error('[AI Router] OpenAI API error:', error);
        throw error;
      }
    }
  };

  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};
