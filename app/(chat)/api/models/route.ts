import { models } from '@/lib/ai/models';

export interface ModelProvider {
  id: string;
  name: string;
  models: Array<{
    id: string;
    name: string;
    apiIdentifier: string;
  }>;
}

export async function GET() {
  try {
    return Response.json(models);
  } catch (error) {
    console.error('[Models Route] Error:', error);
    let errorMessage = 'Unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        details: errorMessage 
      }), 
      { status: 500 }
    );
  }
} 