import type { ChatType } from '@/api/chat/types';
import ChatHeader from './ChatHeader.vue';
import ChatMessageBox from './ChatMessageBox.vue';
import ChatToolBar from './ChatToolBar.vue';
import ChatInputBox from './ChatInputBox.vue';
import ChatInstance from './ChatInstance.vue';
import ChatList from './ChatList.vue';

type ChatInfo = {
  chatId: number;
  chatType: ChatType;
  name: string;
  remark: string;
  avatar: string;
  muted: boolean;
};

export {
  ChatHeader,
  ChatMessageBox,
  ChatToolBar,
  ChatInputBox,
  ChatInstance,
  ChatList,
  type ChatInfo,
};
