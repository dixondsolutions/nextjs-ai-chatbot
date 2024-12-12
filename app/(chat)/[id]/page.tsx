import { Message } from 'ai';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getMessagesByChatId } from '@/lib/db/queries';
import { Metadata } from 'next';

// Add Next.js specific types
type ChatPageProps = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function ChatPage({ params }: ChatPageProps) {
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

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  return {
    title: `Chat ${params.id}`,
  };
} 