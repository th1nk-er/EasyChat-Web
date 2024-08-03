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
import { LeftNavigation } from "./components";
import { stompClient } from "@/utils/ws";
import { MessageType, type ChatMessage } from "@/api/chat/types";
import { useUserStore } from "@/stores/user";
import { getUserInfo } from "@/api/user";
const userStore = useUserStore();
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
const handleWsMessage = (message: ChatMessage) => {
  console.log(message);

  if (message.type == MessageType.SYSTEM) {
    handleSystemMessage(message);
    return;
  } else if (message.type == MessageType.COMMAND) {
    handleCommandMessage(message);
    return;
  }
};
const handleCommandMessage = (message: ChatMessage) => {
  switch (message.content) {
    case "CONNECTED":
      ElMessage.success("已连接到通信服务器");
      //TODO 设置store变量存储连接状态
      break;
    default:
      break;
  }
};
const handleSystemMessage = (message: ChatMessage) => {};
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  min-height: 600px;
  display: flex;
}
.center-box {
  flex-grow: 1;
  height: 100vh;
}
</style>
