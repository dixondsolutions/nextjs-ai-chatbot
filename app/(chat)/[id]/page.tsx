import { Message } from 'ai';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getMessagesByChatId } from '@/lib/db/queries';
import { Metadata } from 'next';

// Define the page params type
type PageParams = {
  id: string;
}

// Define the page component
export default async function ChatPage({
  params,
}: {
  params: PageParams;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const messages = await getMessagesByChatId({ id: params.id }) as Message[];

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

// Define metadata generation
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  return {
    title: `Chat ${params.id}`,
  };
} 