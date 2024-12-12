import { auth } from '@/app/(auth)/auth';
import { getChatsByUserId } from '@/lib/db/queries';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.error('[History Route] Unauthorized: No session or user');
      return new Response('Unauthorized', { status: 401 });
    }

    const chats = await getChatsByUserId({ id: session.user.id });
    return Response.json(chats);
  } catch (error) {
    console.error('[History Route] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }), 
      { status: 500 }
    );
  }
}
