<template>
  <div class="container">
    <ChatList />
    <ChatInstance />
  </div>
</template>
<script setup lang="ts">
import {
  sendConnect,
  subscribeGroupMessage,
  subscribeMessage,
} from '@/api/chat';
import { useWSStore } from '@/stores/ws';
import {
  ChatType,
  MessageCommand,
  MessageType,
  type WSMessage,
} from '@/api/chat/types';
import { useUserStore } from '@/stores/user';
import { useChatStore } from '@/stores/chat';
import { ChatList, ChatInstance } from './components';
import { useGroupStore } from '@/stores/group';
const userStore = useUserStore();
const chatStore = useChatStore();
const groupStore = useGroupStore();
const wsStore = useWSStore();
const router = useRouter();
const wsConnect = () => {
  const userToken = userStore.getUserToken?.token;
  if (userToken == undefined) {
    router.push({ name: 'Login' });
  } else {
    wsStore.stompClient.activate();
    wsStore.stompClient.onConnect = () => {
      if (!subscribeMessage((msg) => handleWsMessage(msg))) {
        ElMessage.error('无法连接到通信服务器');
        return;
      }
      sendConnect();
    };
  }
};
onMounted(async () => {
  wsConnect();
  groupStore.loadGroupList();
});
watch(
  () => groupStore.loaded,
  (val) => {
    if (val) {
      groupStore.groupList.forEach((group) => {
        subscribeGroupMessage(group.groupId, (msg) => handleWsMessage(msg));
      });
    }
  }
);
const handleWsMessage = (message: WSMessage) => {
  if (message.messageType == MessageType.SYSTEM) {
    handleSystemMessage(message);
  } else if (message.messageType == MessageType.COMMAND) {
    handleCommandMessage(message);
  } else if (message.messageType == MessageType.ERROR) {
    ElMessage.error(message.content);
  } else {
    handleUserMessage(message);
  }
};
const handleCommandMessage = (message: WSMessage) => {
  switch (message.content) {
    case MessageCommand.CONNECTED:
      ElMessage.success('已连接到通信服务器');
      break;
    default:
      break;
  }
};
const handleSystemMessage = (message: WSMessage) => {};
const handleUserMessage = async (message: WSMessage) => {
  if (message.chatType == ChatType.GROUP) {
    await groupStore.loadIgnoredMembers(message.toId);
    const ignoredList = groupStore.getIgnoredList(message.toId);
    if (ignoredList.find((m) => m.ignoredId == message.fromId)) return;
  }
  chatStore.updateConversation(message);
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
}
</style>
