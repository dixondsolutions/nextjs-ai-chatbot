import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export interface ModelProvider {
  id: string;
  name: string;
  models: Model[];
}

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  provider: string;
}

async function getAnthropicModels(): Promise<Model[]> {
  try {
    // You could fetch this from Anthropic's API if they provide one
    return [
      {
        id: 'claude-3-5-sonnet',
        label: 'Claude 3.5 Sonnet',
        apiIdentifier: 'claude-3-5-sonnet-20241022',
        description: 'Latest Claude model, best for complex tasks',
        provider: 'anthropic'
      }
    ];
  } catch (error) {
    console.error('Failed to fetch Anthropic models:', error);
    return [];
  }
}

async function getOpenAIModels(): Promise<Model[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    const data = await response.json();
    
    // Filter and format the models you want to expose
    return data.data
      .filter((model: any) => model.id.startsWith('gpt-'))
      .map((model: any) => ({
        id: model.id,
        label: model.id,
        apiIdentifier: model.id,
        description: model.description || 'OpenAI model',
        provider: 'openai'
      }));
  } catch (error) {
    console.error('Failed to fetch OpenAI models:', error);
    return [];
  }
}

export async function GET() {
  try {
    const [anthropicModels, openaiModels] = await Promise.all([
      getAnthropicModels(),
      getOpenAIModels()
    ]);

    const providers: ModelProvider[] = [
      {
        id: 'anthropic',
        name: 'Anthropic',
        models: anthropicModels
      },
      {
        id: 'openai',
        name: 'OpenAI',
        models: openaiModels
      }
    ];

    return Response.json(providers);
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return new Response('Failed to fetch models', { status: 500 });
  }
} 