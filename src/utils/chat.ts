import { type WSMessage, type ChatMessage } from '@/api/chat/types';

export const getMessageCommandParams = (message: WSMessage | ChatMessage) => {
  if (message.params == undefined) return [];
  return JSON.parse(message.params) as string[];
};
