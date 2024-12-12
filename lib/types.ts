import type { ToolInvocation } from 'ai';

export interface MessageAnnotation {
  messageIdFromServer?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  chatId: string;
  toolInvocations?: ToolInvocation[];
  annotations?: MessageAnnotation[];
}

export interface CoreMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolInvocations?: ToolInvocation[];
} 