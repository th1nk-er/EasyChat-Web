<template>
  <div class="main">
    <LeftNavigation />
    <div class="center-box">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendConnect, subscribeMessage } from "@/api/chat";
import LeftNavigation from "@/components/common/LeftNavigation.vue";
import { stompClient } from "@/utils/ws";
import { MessageType, type WSMessage } from "@/api/chat/types";
import { useUserStore } from "@/stores/user";
import { getUserInfo } from "@/api/user";
import { useChatStore } from "@/stores/chat";
const userStore = useUserStore();
const chatStore = useChatStore();
const router = useRouter();
const wsConnect = () => {
  const userToken = userStore.getUserToken?.token;
  if (userToken == undefined) {
    router.push({ name: "Login" });
  } else {
    stompClient.activate();
    stompClient.onConnect = () => {
      if (!subscribeMessage((msg) => handleWsMessage(msg))) {
        ElMessage.error("无法连接到通信服务器");
        return;
      }
      sendConnect();
    };
  }
};
onMounted(async () => {
  wsConnect();
  userStore.userInfo = (await getUserInfo()).data;
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
    case "CONNECTED":
      ElMessage.success("已连接到通信服务器");
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
}
</style>
