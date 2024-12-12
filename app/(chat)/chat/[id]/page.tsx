import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertToUIMessages } from '@/lib/utils';

export default async function ChatPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const messagesFromDb = await getMessagesByChatId({ id: params.id });
  const chat = await getChatById({ id: params.id });

  if (!chat) {
    notFound();
  }

  // Default to Claude if no model is set
  const defaultModel = 'claude-3-5-sonnet';

  return (
    <Chat 
      id={params.id} 
      initialMessages={convertToUIMessages(messagesFromDb)}
      selectedModelId={chat.modelId ?? defaultModel}
      selectedVisibilityType={chat.visibility || 'private'}
      isReadonly={chat.userId !== session.user.id}
    />
  );
}
