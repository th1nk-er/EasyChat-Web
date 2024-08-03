<template>
  <div class="no-user" v-if="chatStore.chatId == undefined">
    <IconForum class="icon-forum" />
  </div>
  <div class="container" v-if="chatStore.chatId != undefined">
    <div class="container__header">
      <div class="container__header__title">
        <div class="container__header__title__name">th1nk</div>
        <IconNotificationOff class="container__header__title__muted" />
      </div>
      <IconMoreHoriz class="container__header__more" />
    </div>
    <div class="container__main">
      <div class="message-container" ref="msgBox">
        <div
          :class="
            item.fromId == userStore.userInfo.id
              ? 'message-container-item item-right'
              : 'message-container-item item-left'
          "
          v-for="(item, index) in messageData"
          :key="index"
        >
          <img
            src="https://avatars.githubusercontent.com/u/69061641?v=4"
            class="message-container-item-avatar"
          />
          <p class="message-container-item-content">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessageType, type ChatMessage } from "@/api/chat/types";
import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";
const chatStore = useChatStore();
const userStore = useUserStore();
const messageData = ref<ChatMessage[]>([]);
const msgBox = ref<HTMLElement>();
const scrollToBottom = (delay: number = 200) => {
  setTimeout(() => {
    msgBox.value?.scrollTo({
      top: msgBox.value?.scrollHeight,
      behavior: "smooth",
    });
  }, delay);
};
onMounted(() => {
  // 添加测试数据
  for (let i = 0; i < 50; i++) {
    const fromId = "" + Math.round(Math.random() + 1);
    const toId = fromId == "1" ? "2" : "1";
    messageData.value?.push({
      type: MessageType.TEXT,
      content: "测试消息" + i,
      fromId: userStore.userInfo.id,
      toId: chatStore.chatId,
    });
  }
  scrollToBottom();
});
</script>
<style scoped lang="scss">
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
        gap: 8px;
        &-content {
          border-radius: 5px;
          padding: 3px 8px;
          background-color: var(--color-background-mute);
          max-width: 55%;
        }
        &-avatar {
          width: 40px;
          height: 40px;
        }

        &.item-right {
          flex-direction: row-reverse;

          .message-container-item-content {
            background-color: rgb(149, 236, 105);
          }
        }
      }
    }
  }
}
</style>
