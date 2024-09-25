<template>
  <div class="no-user" v-if="!chatStore.isChatting">
    <IconForum class="icon-forum" />
  </div>
  <div class="container" v-if="chatStore.isChatting">
    <ChatHeader :chat-info="chatInfo" :key="componentKey" />
    <div class="container__main">
      <ChatMessageBox
        ref="msgBox"
        :message-data="messageData"
        :chat-info="chatInfo"
        @on-get-more-message="getMoreMessage"
        :key="componentKey"
      />
      <ChatToolBar
        @on-emoji-selected="handleEmojiSelected"
        @on-image-upload="handleImageUpload"
        :key="componentKey"
      />
      <ChatInputBox
        v-model:message="inputMessage"
        v-model:image-src="imageSrc"
        v-model:image-file="imgFile"
        @on-send-message="handleSendMessage"
        ref="inputBox"
        :key="componentKey"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  getGroupMessageHistory,
  getMessageHistory,
  publishOpenConversation,
  sendMessage,
  subscribeGroupMessage,
  subscribeMessage,
  uploadChatImage,
} from '@/api/chat';
import {
  ChatType,
  MessageType,
  type ChatMessage,
  type WSMessage,
} from '@/api/chat/types';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
import { ChatHeader, ChatInputBox, ChatMessageBox, ChatToolBar } from '.';
const componentKey = ref(0);
const chatStore = useChatStore();
const userStore = useUserStore();
const messageData = ref<ChatMessage[]>([]);
const msgBox = ref();
/** 用户输入的消息 */
const inputMessage = ref('');
/** 消息输入框 */
const inputBox = ref();
const _sendMessage = (message: WSMessage) => {
  if (!sendMessage(message)) {
    ElMessage.error('消息发送失败');
    return;
  }
  messageData.value.push({
    senderId: userStore.userInfo.id,
    receiverId: chatInfo.value.chatId,
    messageType: message.messageType,
    content: message.content,
    createTime: new Date().toISOString(),
    chatType: chatInfo.value.chatType,
  });
  chatStore.updateConversation(message);
  inputMessage.value = '';
  scrollToBottom();
};
/** 处理发送消息 */
const handleSendMessage = async () => {
  if (inputMessage.value.trim() != '') {
    _sendMessage({
      messageType: MessageType.TEXT,
      content: inputMessage.value,
      fromId: userStore.userInfo.id,
      toId: chatInfo.value.chatId,
      chatType: chatInfo.value.chatType,
    });
  }
  if (imgFile.value) {
    const resp = await uploadChatImage(imgFile.value);
    _sendMessage({
      messageType: MessageType.IMAGE,
      content: resp.data,
      fromId: userStore.userInfo.id,
      toId: chatInfo.value.chatId,
      chatType: chatInfo.value.chatType,
    });
    imgFile.value = undefined;
    imageSrc.value = '';
  }
};
/** 当用户选择表情 */
const handleEmojiSelected = (emoji: string) => {
  inputMessage.value = inputMessage.value + emoji;
  inputBox.value.input.focus();
};
const imageSrc = ref('');
const imgFile = ref<File>();
const handleImageUpload = (file: File, imgUrl: string) => {
  imgFile.value = file;
  imageSrc.value = imgUrl;
};
/** 将对话框滚动到最底部 */
const scrollToBottom = (delay: number = 200) => {
  setTimeout(() => {
    msgBox.value?.scrollToBottom();
  }, delay);
};
const chatInfo = ref({
  chatId: 0,
  chatType: ChatType.FRIEND,
  name: '',
  remark: '',
  avatar: '',
  muted: false,
});
/** 初始化数据 */
const initChatData = async () => {
  componentKey.value++;
  msgPageIndex.value = 0;
  messageData.value = [];
  if (!chatStore.isChatting) return;
  chatInfo.value.chatType = chatStore.chatType;
  chatInfo.value.chatId = chatStore.chatId;
  publishOpenConversation(chatStore.chatId, chatStore.chatType);
  chatStore.addConversation(chatStore.chatId, chatStore.chatType);
  const con = chatStore.getConversation(chatStore.chatId, chatStore.chatType);
  if (con) {
    chatInfo.value.name = con.nickname;
    chatInfo.value.remark = con.remark;
    chatInfo.value.avatar = con.avatar;
    chatInfo.value.muted = con.muted;
  }
  if (chatStore.chatType == ChatType.FRIEND) {
    // 获取最近的消息
    getMoreMessage();
    // 订阅消息
    subscribeMessage((message: WSMessage) => {
      onReceiveMessage(message);
    });
  } else if (chatStore.chatType == ChatType.GROUP) {
    getMoreMessage();
    subscribeGroupMessage(chatInfo.value.chatId, (message: WSMessage) => {
      onReceiveMessage(message);
    });
  }
};
const onReceiveMessage = (message: WSMessage) => {
  if (
    message.fromId == chatStore.chatId &&
    message.chatType == ChatType.FRIEND
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
  } else if (
    message.fromId != userStore.userInfo.id &&
    message.toId == chatStore.chatId &&
    message.chatType == ChatType.GROUP
  ) {
    messageData.value.push({
      senderId: message.fromId,
      receiverId: chatStore.chatId,
      messageType: message.messageType,
      content: message.content,
      createTime: new Date().toISOString(),
      chatType: message.chatType,
    });
    scrollToBottom();
  }
};
watch(
  () => chatStore.chatId,
  (value) => {
    if (value > 0) initChatData();
  }
);
const msgPageIndex = ref(0);
const hasMoreMessage = ref(true);
const getMoreMessage = async () => {
  if (!hasMoreMessage.value) return;
  if (chatInfo.value.chatType == ChatType.FRIEND) {
    const resp = await getMessageHistory(
      userStore.userInfo.id,
      chatInfo.value.chatId,
      msgPageIndex.value++
    );
    if (resp.data.length == 0) {
      hasMoreMessage.value = false;
      return;
    }
    messageData.value.unshift(...resp.data);
  } else if (chatInfo.value.chatType == ChatType.GROUP) {
    const resp = await getGroupMessageHistory(
      chatInfo.value.chatId,
      msgPageIndex.value++
    );
    if (resp.data.length == 0) {
      hasMoreMessage.value = false;
      return;
    }
    messageData.value.unshift(...resp.data);
  }
};
onMounted(() => {
  if (chatStore.isChatting) initChatData();
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
  &__main {
    flex-grow: 1;
    background-color: var(--color-background-soft);
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
}
</style>
