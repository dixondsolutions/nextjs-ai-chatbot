import { Message } from 'ai';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getMessagesByChatId } from '@/lib/db/queries';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ChatPage({
  params,
  searchParams,
}: Props) {
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