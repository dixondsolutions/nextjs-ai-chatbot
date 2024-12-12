import { Message } from 'ai';

export type ChatPageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type ChatPageData = {
  messages: Message[];
}; 