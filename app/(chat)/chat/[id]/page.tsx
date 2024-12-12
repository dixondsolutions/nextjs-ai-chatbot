import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';

interface PageProps {
  params: { id: string };
}

export default async function ChatPage({ params }: PageProps) {
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
