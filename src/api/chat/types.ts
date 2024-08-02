export type ChatMessage = {
  type: MessageType;
  content: string;
  fromId: string;
  toId?: string;
  groupId?: string;
};

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
  ERROR = "ERROR",
  COMMAND = "COMMAND",
}
