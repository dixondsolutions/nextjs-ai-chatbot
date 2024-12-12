export function getSystemPrompt(provider: string) {
  switch (provider) {
    case 'anthropic':
      return 'You are Claude, a friendly and helpful AI assistant. Keep your responses concise and helpful.';
    case 'openai':
      return 'You are a helpful AI assistant. Keep your responses concise and helpful.';
    default:
      return 'You are a friendly and helpful assistant. Keep your responses concise and helpful.';
  }
}

export const systemPrompt = getSystemPrompt('default');
