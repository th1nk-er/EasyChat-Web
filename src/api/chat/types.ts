export type ChatMessage = {
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
