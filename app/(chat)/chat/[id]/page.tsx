import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertToUIMessages } from '@/lib/utils';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const messages = await getMessagesByChatId({ id: params.id });
  const chat = await getChatById({ id: params.id });

  if (!chat) {
    notFound();
  }

  return (
    <Chat 
      id={params.id} 
      initialMessages={messages}
      selectedModelId={chat.modelId || 'claude-3-5-sonnet'}
      selectedVisibilityType={chat.visibility || 'private'}
      isReadonly={chat.userId !== session.user.id}
    />
  );
}
