<template>
  <div class="no-user" v-if="!chatStore.isChatting">
    <IconForum class="icon-forum" />
  </div>
  <div class="container" v-if="chatStore.isChatting">
    <div class="container__header">
      <div class="container__header__title">
        <FriendInfoDialog
          v-model="friendInfoDialogShow"
          :friend-info="friendInfo"
          @on-friend-info-update="onFriendInfoUpdate"
        />
        <div
          class="container__header__title__name"
          @click="friendInfoDialogShow = true"
        >
          <span
            v-if="chatInfo.remark == undefined || chatInfo.remark.length == 0"
            >{{ chatInfo.name }}</span
          >
          <span v-else>{{ chatInfo.remark }}</span>
        </div>
        <IconNotificationOff
          class="container__header__title__muted"
          v-if="chatInfo.muted"
        />
      </div>
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
      <div class="toolbar-container">
        <div class="emoji-selector-container">
          <IconMood
            class="icon-mood"
            @click="emojiSelectorVisible = !emojiSelectorVisible"
          />
          <EmojiPicker
            :native="true"
            theme="auto"
            class="emoji-picker"
            :display-recent="true"
            :hide-group-names="true"
            v-show="emojiSelectorVisible"
            @select="onSelectEmoji"
          />
        </div>
      </div>
      <div class="input-container">
        <el-input
          v-model="inputMessage"
          type="textarea"
          resize="none"
          :rows="4"
          maxlength="1024"
          class="input-container__textarea"
          @keydown.enter.native="handleEnterDown"
          ref="messageInputRef"
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
import FriendInfoDialog from "@/components/friend/FriendInfoDialog.vue";
import {
  getMessageHistory,
  publishOpenConversation,
  sendMessage,
  subscribeMessage,
} from "@/api/chat";
import {
  ChatType,
  MessageType,
  type ChatMessage,
  type WSMessage,
} from "@/api/chat/types";
import { getFriendInfo } from "@/api/friend";
import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";
import { getTimeString } from "@/utils/timeUtils";
import { getAvatarUrl } from "@/utils/userUtils";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import type { UserFriendVo } from "@/api/friend/types";
import { UserSex } from "@/api/user/types";
const emojiSelectorVisible = ref(false);

const chatStore = useChatStore();
const userStore = useUserStore();
const messageData = ref<ChatMessage[]>([]);
const msgBox = ref<HTMLElement>();

const friendInfoDialogShow = ref(false);
const friendInfo = ref<UserFriendVo>({
  friendId: 0,
  nickname: "",
  username: "",
  avatar: "",
  sex: UserSex.SECRET,
  createTime: "",
  remark: "",
  muted: false,
});
const onFriendInfoUpdate = (data: UserFriendVo) => {
  friendInfo.value = data;
  chatInfo.value.chatId = data.friendId;
  chatInfo.value.name = data.nickname;
  chatInfo.value.remark = data.remark;
  chatInfo.value.avatar = data.avatar;
  chatInfo.value.muted = data.muted;
};
/** 用户输入的消息 */
const inputMessage = ref("");
/** 消息输入框 */
const messageInputRef = ref<HTMLElement>();
/** 处理用户按下回车 */
const handleEnterDown = (e: Event | KeyboardEvent) => {
  if (e instanceof KeyboardEvent) {
    if (e.shiftKey) {
      inputMessage.value += "\n";
    } else {
      e.preventDefault();
      handleSendMessage();
    }
  }
};
/** 处理发送消息 */
const handleSendMessage = () => {
  if (inputMessage.value.trim() == "") {
    inputMessage.value = "";
    return;
  }
  const message: WSMessage = {
    messageType: MessageType.TEXT,
    content: inputMessage.value,
    fromId: userStore.userInfo.id,
    toId: chatStore.chatId,
    chatType: chatStore.chatType,
  };
  if (!sendMessage(message)) {
    ElMessage.error("消息发送失败");
    return;
  }
  messageData.value.push({
    senderId: userStore.userInfo.id,
    receiverId: chatStore.chatId,
    messageType: MessageType.TEXT,
    content: inputMessage.value,
    createTime: new Date().toISOString(),
    chatType: chatStore.chatType,
  });
  chatStore.updateConversation(message);
  inputMessage.value = "";
  scrollToBottom();
};

/** 当用户选择表情 */
const onSelectEmoji = (emoji: any) => {
  emojiSelectorVisible.value = false;
  inputMessage.value = inputMessage.value + emoji.i;
  messageInputRef.value?.focus();
};
/** 将对话框滚动到最底部 */
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
/** 初始化数据 */
const initChatData = async () => {
  messageData.value = [];
  if (!chatStore.isChatting) return;
  publishOpenConversation(chatStore.chatId, chatStore.chatType);
  if (chatStore.chatType == ChatType.FRIEND) {
    const resp = await getFriendInfo(chatStore.chatId);
    friendInfo.value = resp.data;
    chatStore.updateFriendConversation(resp.data);
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
      if (
        message.fromId == chatStore.chatId &&
        message.chatType == chatStore.chatType
      ) {
        messageData.value.push({
          senderId: message.fromId,
          receiverId: userStore.userInfo.id,
          messageType: message.messageType,
          content: message.content,
          createTime: new Date().toISOString(),
          chatType: message.chatType,
        });
        scrollToBottom();
      }
    });
  }
};
const isChatting = computed(() => chatStore.isChatting);
watch(isChatting, (value) => {
  if (value) initChatData();
});
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
        cursor: pointer;
        &:hover {
          // 添加下划线
          text-decoration: underline;
        }
      }
      &__muted {
        width: 20px;
        height: 20px;
        fill: var(--color-subtitle);
      }
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
        animation-range: entry 0% cover 10%;
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
          font-size: 1.2rem;
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
      padding-left: 10px;
      .emoji-selector-container {
        position: relative;
        .icon-mood {
          cursor: pointer;
          &:hover {
            fill: dodgerblue;
          }
        }
        .emoji-picker {
          position: absolute;
          bottom: 110%;
        }
      }
    }
    .input-container {
      flex-grow: 1;
      padding: 3px 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      &__textarea {
        width: 100%;
        font-size: 1.2rem;
      }
    }
  }
}
</style>
