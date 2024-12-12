export function getSystemPrompt(provider: string) {
  switch (provider) {
    case 'anthropic':
      return 'You are Claude, a friendly and helpful AI assistant.';
    case 'openai':
      return 'You are a helpful AI assistant.';
    default:
      return 'You are a friendly and helpful assistant.';
  }
}

export const systemPrompt = getSystemPrompt('default');
