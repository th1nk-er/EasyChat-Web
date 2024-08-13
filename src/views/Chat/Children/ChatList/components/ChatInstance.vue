<template>
  <div class="no-user" v-if="!chatStore.isChatting">
    <IconForum class="icon-forum" />
  </div>
  <div class="container" v-if="chatStore.isChatting">
    <div class="container__header">
      <div class="container__header__title">
        <div class="container__header__title__name">
          <span v-if="chatInfo.remark == undefined">{{ chatInfo.name }}</span>
          <span v-else>{{ chatInfo.remark }}</span>
        </div>
        <IconNotificationOff
          class="container__header__title__muted"
          v-if="chatInfo.muted"
        />
      </div>
      <IconMoreHoriz class="container__header__more" />
    </div>
    <div class="container__main">
      <div class="message-container" ref="msgBox">
        <div
          class="message-container-item"
          v-for="(item, index) in messageData"
          :key="index"
        >
          <p
            class="message-container-item-time"
            v-if="
              index != 0 &&
              new Date(item.createTime).getTime() -
                new Date(messageData[index - 1].createTime).getTime() >
                1000 * 60 * 3
            "
          >
            {{ getTimeString(item.createTime) }}
          </p>
          <div
            :class="
              item.senderId == userStore.userInfo.id
                ? 'item-right'
                : 'item-left'
            "
          >
            <img
              :src="
                item.senderId == userStore.userInfo.id
                  ? getAvatarUrl(userStore.userInfo.avatar)
                  : getAvatarUrl(chatInfo.avatar)
              "
              class="message-container-item-avatar"
            />
            <p class="message-container-item-content">
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>
      <div class="toolbar-container"></div>
      <div class="input-container">
        <el-input
          v-model="inputMessage"
          type="textarea"
          resize="none"
          :rows="5"
          maxlength="1024"
          class="input-container__textarea"
          @keyup.enter.prevent="handleSendMessage"
        />
        <el-button
          class="input-container__button-send"
          type="primary"
          @click="handleSendMessage"
          >发送</el-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  getMessageHistory,
  publishOpenConversation,
  sendMessage,
  subscribeMessage,
} from "@/api/chat";
import {
  MessageType,
  type ChatMessage,
  type WSMessage,
} from "@/api/chat/types";
import { getFriendInfo } from "@/api/friend";
import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";
import { getTimeString } from "@/utils/timeUtils";
import { getAvatarUrl } from "@/utils/userUtils";
const chatStore = useChatStore();
const userStore = useUserStore();
const messageData = ref<ChatMessage[]>([]);
const msgBox = ref<HTMLElement>();

/** 用户输入的消息 */
const inputMessage = ref("");
const handleSendMessage = () => {
  if (inputMessage.value == "") return;
  if (inputMessage.value.endsWith("\n"))
    inputMessage.value = inputMessage.value.slice(
      0,
      inputMessage.value.length - 1
    );
  const message: WSMessage = {
    type: MessageType.TEXT,
    content: inputMessage.value,
    fromId: userStore.userInfo.id,
    toId: chatStore.chatId,
  };
  if (!sendMessage(message)) {
    ElMessage.error("消息发送失败");
    return;
  }
  messageData.value.push({
    senderId: userStore.userInfo.id,
    receiverId: chatStore.chatId!,
    type: MessageType.TEXT,
    content: inputMessage.value,
    createTime: new Date().toISOString(),
  });
  chatStore.updateConversation(message);
  inputMessage.value = "";
  scrollToBottom();
};
const scrollToBottom = (delay: number = 200) => {
  setTimeout(() => {
    msgBox.value?.scrollTo({
      top: msgBox.value?.scrollHeight,
      behavior: "smooth",
    });
  }, delay);
};
const chatInfo = ref({
  chatId: 0,
  name: "",
  remark: "",
  avatar: "",
  muted: false,
});
const initChatData = async () => {
  messageData.value = [];
  if (!chatStore.isChatting) return;
  if (chatStore.chatType == "friend") {
    publishOpenConversation(chatStore.chatId!);
    const resp = await getFriendInfo(chatStore.chatId!);
    chatInfo.value.chatId = resp.data.friendId;
    chatInfo.value.name = resp.data.nickname;
    chatInfo.value.remark = resp.data.remark;
    chatInfo.value.avatar = resp.data.avatar;
    chatInfo.value.muted = resp.data.muted;
    // 获取最近的消息
    messageData.value.push(
      ...(await getMessageHistory(chatInfo.value.chatId, 1)).data
    );
    scrollToBottom();
    // 订阅消息
    subscribeMessage((message: WSMessage) => {
      if (message.fromId == chatStore.chatId) {
        messageData.value.push({
          senderId: message.fromId,
          receiverId: userStore.userInfo.id,
          type: message.type,
          content: message.content,
          createTime: new Date().toISOString(),
        });
        scrollToBottom();
      }
    });
  }
};
watch(
  chatStore,
  () => {
    if (chatStore.isChatting) initChatData();
  },
  { deep: false }
);
onMounted(() => {
  initChatData();
});
</script>
<style scoped lang="scss">
@keyframes appear {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}
.no-user {
  flex-grow: 1;
  background-color: var(--color-background-soft);
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 2px solid var(--color-border);
  .icon-forum {
    height: 20%;
    width: 20%;
    fill: var(--color-subtitle);
  }
}
.container {
  flex-grow: 1;
  min-width: 400px;
  background-color: var(--color-background-mute);
  display: flex;
  flex-direction: column;
  border-left: 2px solid var(--color-border);

  &__header {
    width: 100%;
    height: 65px;
    display: flex;
    align-items: center;
    padding-right: 20px;
    border-bottom: 2px solid var(--color-border);

    &__title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      &__name {
        font-weight: bolder;
        font-size: 20px;
      }
      &__muted {
        width: 20px;
        height: 20px;
        fill: var(--color-subtitle);
      }
    }
    &__more {
      width: 30px;
      height: 30px;
    }
  }

  &__main {
    flex-grow: 1;
    background-color: var(--color-background-soft);
    display: flex;
    flex-direction: column;
    gap: 3px;

    .message-container {
      height: 65vh;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      padding: 20px;
      gap: 15px;
      border-bottom: 2px solid var(--color-border);

      &-item {
        display: flex;
        gap: 3px;
        flex-direction: column;
        animation: appear linear;
        animation-timeline: view();
        animation-range: entry 0% cover 25%;
        .item-right,
        .item-left {
          display: flex;
          gap: 8px;
        }
        &-time {
          text-align: center;
          color: var(--color-subtitle);
        }
        &-content {
          border-radius: 5px;
          padding: 3px 8px;

          background-color: var(--color-background-mute);
          max-width: 55%;
          text-wrap: wrap;
          white-space: pre-wrap; /* 保留空格，允许换行 */
          word-break: break-all; /* 允许单词内部断开 */
        }
        &-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .item-right {
          flex-direction: row-reverse;

          .message-container-item-content {
            color: black;
            background-color: rgb(149, 236, 105);
          }
        }
      }
    }
    .toolbar-container {
      height: 30px;
      border-bottom: 2px solid var(--color-border);
    }
    .input-container {
      flex-grow: 1;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      &__textarea {
        width: 100%;
      }
    }
  }
}
</style>
