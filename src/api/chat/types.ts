export type WSMessage = {
  messageType: MessageType;
  content: string;
  fromId: number;
  toId: number;
  chatType: ChatType;
};

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
  ERROR = 'ERROR',
  COMMAND = 'COMMAND',
}

export enum ChatType {
  FRIEND = 'FRIEND',
  GROUP = 'GROUP',
}

export type ChatMessage = {
  id?: number;
  senderId: number;
  chatType: ChatType;
  receiverId: number;
  messageType: MessageType;
  content: string;
  createTime: string;
};

export type UserConversation = {
  id: number;
  uid: number;
  avatar: string;
  nickname: string;
  remark: string;
  chatId: number;
  chatType: ChatType;
  muted: boolean;
  unreadCount: number;
  lastMessage: string;
  messageType: MessageType;
  updateTime: string;
};
