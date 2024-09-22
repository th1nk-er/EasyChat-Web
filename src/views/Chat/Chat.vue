<template>
  <div class="main">
    <LeftNavigation />
    <div class="center-box">
      <ChatList />
      <ChatInstance />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  sendConnect,
  subscribeGroupMessage,
  subscribeMessage,
} from '@/api/chat';
import LeftNavigation from '@/components/common/LeftNavigation.vue';
import { useWSStore } from '@/stores/ws';
import { MessageType, type WSMessage } from '@/api/chat/types';
import { useUserStore } from '@/stores/user';
import { getUserInfo } from '@/api/user';
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
  userStore.userInfo = (await getUserInfo()).data;
  if (groupStore.groupList.length == 0) groupStore.loadGroupList();
  groupStore.groupList.forEach((group) => {
    subscribeGroupMessage(group.groupId, (msg) => handleWsMessage(msg));
  });
});
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
    case 'CONNECTED':
      ElMessage.success('已连接到通信服务器');
      break;
    default:
      break;
  }
};
const handleSystemMessage = (message: WSMessage) => {};
const handleUserMessage = (message: WSMessage) => {
  chatStore.updateConversation(message);
};
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  min-height: 600px;
  display: flex;
}
.center-box {
  flex-grow: 1;
  height: 100%;
  display: flex;
}
</style>
