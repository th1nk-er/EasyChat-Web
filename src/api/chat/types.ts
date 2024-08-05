export type WSMessage = {
  type: MessageType;
  content: string;
  fromId: number;
  toId?: number;
  groupId?: number;
};

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
  ERROR = "ERROR",
  COMMAND = "COMMAND",
}

export type ChatMessage = {
  id?: number;
  senderId?: number;
  senderGroupId?: number;
  receiverId: number;
  type: MessageType;
  content: string;
  createTime: string;
};
