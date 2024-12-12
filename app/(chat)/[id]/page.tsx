import { Message } from 'ai';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getMessagesByChatId } from '@/lib/db/queries';
import { Metadata } from 'next';

async function getChatData(id: string): Promise<Message[]> {
  return await getMessagesByChatId({ id }) as Message[];
}

async function getPageSession() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

export default async function ChatPage({
  params,
}: {
  params: { id: string };
}) {
  await getPageSession();
  const messages = await getChatData(params.id);

  return (
    <Chat 
      id={params.id} 
      initialMessages={messages}
      selectedModelId="claude-3-sonnet"
      selectedVisibilityType="private"
      isReadonly={false}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Chat ${params.id}`,
  };
} 