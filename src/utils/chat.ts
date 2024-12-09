import { type WSMessage, type ChatMessage } from '@/api/chat/types';

export const getMessageCommandParams = (message: WSMessage | ChatMessage) => {
  if (message.params == undefined) return [];
  if ('id' in message) return JSON.parse(message.params as string) as string[];
  else return message.params as string[];
};
