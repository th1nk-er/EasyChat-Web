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
        @onMemberIgnoreChanged="handleMemberIgnoreChanged"
        :key="componentKey"
        v-loading="isloading"
      />
      <ChatToolBar
        @on-emoji-selected="handleEmojiSelected"
        @on-image-upload="handleImageUpload"
        :chat-info="chatInfo"
        v-model:files="chatFiles"
        :key="componentKey"
      />
      <ChatInputBox
        v-model:message="inputMessage"
        v-model:image-src="imageSrc"
        v-model:image-file="imgFile"
        v-model:mute-info="muteInfo"
        :chat-info="chatInfo"
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
  uploadChatFileChunk,
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
import type {
  GroupMemberIgnoredVo,
  GroupMemberMuteVo,
} from '@/api/group/types';
import { useGroupStore } from '@/stores/group';
import { getGroupMemberMuteInfo } from '@/api/group';
import type { StompSubscription } from '@stomp/stompjs';
const componentKey = ref(0);
const isloading = ref(false);
const chatStore = useChatStore();
const groupStore = useGroupStore();
const userStore = useUserStore();
const messageData = ref<ChatMessage[]>([]);
const ignoredMembers = ref([] as GroupMemberIgnoredVo[]);
const muteInfo = ref({} as GroupMemberMuteVo);
const msgBox = ref();
/** 用户输入的消息 */
const inputMessage = ref('');
/** 消息输入框 */
const inputBox = ref();
const chatFiles = ref([] as File[]);
const isSending = ref(false);
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
    params: message.params,
  });
  chatStore.updateConversation(message);
  inputMessage.value = '';
  scrollToBottom();
};
/** 处理发送消息 */
const handleSendMessage = async () => {
  isSending.value = true;
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
  if (chatFiles.value.length > 0) {
    const uploadeds = await uploadFiles();
    if (uploadeds) {
      for (const file of uploadeds) {
        console.log('发送消息', file.name);
        _sendMessage({
          messageType: MessageType.FILE,
          content: file.name,
          fromId: userStore.userInfo.id,
          toId: chatInfo.value.chatId,
          chatType: chatInfo.value.chatType,
          params: [file.uri],
        });
      }
    }
  }
  isSending.value = false;
};
const uploadFiles = async () => {
  const chunkSize = 1024 * 1024 * 2; // 2MB
  const files = chatFiles.value;
  const uploadedFiles = [] as { uri: string; name: string }[];
  for (const file of files) {
    const totalChunks = Math.ceil(file.size / chunkSize);
    let uploadedChunks = 0;
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      try {
        const resp = await uploadChatFileChunk(
          chunk,
          file.name,
          totalChunks,
          i
        );
        uploadedChunks++;
        if (resp.data) {
          chatFiles.value = chatFiles.value.filter((f) => f != file);
          uploadedFiles.push({ uri: resp.data, name: file.name });
          return uploadedFiles;
        }
      } catch (error) {
        ElMessage.error('文件上传失败');
      }
    }
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
const isMessageVisible = (msg: ChatMessage) => {
  if (msg.chatType == ChatType.FRIEND) return true;
  if (msg.chatType == ChatType.GROUP) {
    const m = ignoredMembers.value.find((m) => m.ignoredId == msg.senderId);
    if (m) {
      return (
        new Date(m.createTime).getTime() > new Date(msg.createTime).getTime()
      );
    } else return true;
  }
};
const handleMemberIgnoreChanged = (memberId: number, ignored: boolean) => {
  if (ignored) {
    ignoredMembers.value.push({
      ignoredId: memberId,
      groupId: chatInfo.value.chatId,
      userId: userStore.userInfo.id,
      createTime: new Date().toISOString(),
    });
  } else {
    groupStore.cancelIgnoreMember(chatInfo.value.chatId, memberId);
  }
};
const stompSubscription = ref<StompSubscription>();
/** 初始化数据 */
const initChatData = async () => {
  isloading.value = true;
  hasMoreMessage.value = true;
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
  // 获取最近的消息
  getMoreMessage();
  if (chatStore.chatType == ChatType.FRIEND) {
    // 订阅消息
    stompSubscription.value = subscribeMessage((message: WSMessage) => {
      onReceiveMessage(message);
    });
  } else if (chatStore.chatType == ChatType.GROUP) {
    const resp = await getGroupMemberMuteInfo(
      chatInfo.value.chatId,
      userStore.userInfo.id
    );
    muteInfo.value = resp.data;
    await groupStore.loadIgnoredMembers(chatStore.chatId);
    ignoredMembers.value = groupStore.getIgnoredList(chatStore.chatId);
    stompSubscription.value = subscribeGroupMessage(
      chatInfo.value.chatId,
      (message: WSMessage) => {
        onReceiveMessage(message);
      }
    );
  }
  isloading.value = false;
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
      params: message.params,
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
      params: message.params,
    });
    messageData.value = messageData.value.filter(isMessageVisible);
    scrollToBottom();
  }
};
watch(
  () => chatStore.chatId,
  (value) => {
    if (stompSubscription.value) {
      stompSubscription.value.unsubscribe();
    }
    if (value > 0 && chatStore.isChatting) initChatData();
  }
);
const msgPageIndex = ref(0);
const hasMoreMessage = ref(true);
const getMoreMessage = async () => {
  if (!hasMoreMessage.value) return;
  isloading.value = true;
  if (chatInfo.value.chatType == ChatType.FRIEND) {
    const resp = await getMessageHistory(
      userStore.userInfo.id,
      chatInfo.value.chatId,
      msgPageIndex.value++
    );
    if (msgPageIndex.value > 1 && resp.data.length == 0) {
      hasMoreMessage.value = false;
    }
    messageData.value.unshift(...resp.data);
  } else if (chatInfo.value.chatType == ChatType.GROUP) {
    const resp = await getGroupMessageHistory(
      chatInfo.value.chatId,
      msgPageIndex.value++
    );
    if (msgPageIndex.value > 1 && resp.data.length == 0) {
      hasMoreMessage.value = false;
    }
    messageData.value.unshift(...resp.data);
    messageData.value = messageData.value.filter(isMessageVisible);
  }
  isloading.value = false;
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
