// Define your models here.

export interface Model {
  id: string;
  name: string;
  models: Array<Model>;
}

export const models = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        apiIdentifier: 'claude-3-5-sonnet-20241022',
      }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        apiIdentifier: 'gpt-4-turbo-preview',
      }
    ]
  }
];

export const DEFAULT_MODEL_NAME = 'claude-3-5-sonnet-20241022';
