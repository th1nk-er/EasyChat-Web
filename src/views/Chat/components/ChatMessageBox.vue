<template>
  <div class="message-container" ref="msgBox">
    <div class="message-container-item">
      <p class="message-container-item-history">
        <span @click="$emit('onGetMoreMessage')"
          ><IconHistory />查看更多消息</span
        >
      </p>
    </div>
    <div
      class="message-container-item"
      v-for="(item, index) in props.messageData"
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
          item.senderId == userStore.userInfo.id ? 'item-right' : 'item-left'
        "
      >
        <img
          :src="
            item.senderId == userStore.userInfo.id
              ? getFileUrl(userStore.userInfo.avatar)
              : getUserAvatarUrl(item.senderId)
          "
          class="message-container-item-avatar"
          @click="showUserInfo(item.senderId)"
        />
        <p
          class="message-container-item-content"
          v-if="item.messageType == MessageType.TEXT"
        >
          {{ item.content }}
        </p>
        <div
          class="message-container-item-img"
          v-if="item.messageType == MessageType.IMAGE"
          @click="
            previewImgSrc = getFileUrl(item.content);
            previewImgShow = true;
          "
        >
          <img :src="getFileUrl(item.content)" />
        </div>
      </div>
    </div>
    <el-dialog
      v-model="previewImgShow"
      :align-center="true"
      style="display: flex; justify-content: center"
    >
      <img w-full :src="previewImgSrc" style="max-width: 100%" />
    </el-dialog>
    <UserInfoDialog v-model="userInfoDialogShow" />
    <FriendInfoDialog v-model="friendInfoDialogShow" :friend-id="userInfoId" />
  </div>
</template>

<script setup lang="ts">
import { ChatType, type ChatMessage, MessageType } from '@/api/chat/types';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import { getTimeString } from '@/utils/timeUtils';
import UserInfoDialog from '@/components/user/UserInfoDialog.vue';
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';
import type { ChatInfo } from '.';

const msgBox = ref<HTMLElement>();
const props = defineProps({
  messageData: {
    type: Array as PropType<ChatMessage[]>,
    required: true,
  },
  chatInfo: {
    type: Object as PropType<ChatInfo>,
    required: true,
  },
});
defineEmits(['onGetMoreMessage']);

const scrollToBottom = () => {
  msgBox.value?.scrollTo({
    top: msgBox.value?.scrollHeight,
    behavior: 'smooth',
  });
};
const userStore = useUserStore();

//TODO 群组成员信息
const groupUserInfo = ref([]);
const getUserAvatarUrl = (userId: number) => {
  if (props.chatInfo.chatType == ChatType.FRIEND) {
    return getFileUrl(props.chatInfo.avatar);
  } else if (props.chatInfo.chatType == ChatType.GROUP) {
    //TODO 从groupUserInfo中获取头像
    let avatar;
    if (avatar) return avatar;
    else {
      //TODO 获取用户头像，添加到avatarUrlArr
    }
  }
};
const userInfoId = ref(0);
const userInfoDialogShow = ref(false);
const friendInfoDialogShow = ref(false);
const showUserInfo = (id: number) => {
  userInfoId.value = id;
  if (id == userStore.userInfo.id) {
    userInfoDialogShow.value = true;
  } else {
    if (props.chatInfo.chatType == ChatType.FRIEND) {
      friendInfoDialogShow.value = true;
    } else if (props.chatInfo.chatType == ChatType.GROUP) {
      //TODO 获取群成员信息
    }
  }
};
const previewImgShow = ref(false);
const previewImgSrc = ref('');
defineExpose({
  /**
   * 将聊天框滚动到底部
   */
  scrollToBottom,
});
</script>
<style lang="scss" scoped>
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
    &-history {
      color: var(--el-color-primary);
      text-align: center;
      span {
        cursor: pointer;
        display: flex;
        justify-content: center;
        font-size: 0.8rem;
        svg {
          fill: var(--el-color-primary);
          width: 18px;
          height: 18px;
        }
      }
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
    &-img {
      max-width: 15%;
      position: relative;
      img {
        border-radius: 5px;
        width: 100%;
      }
    }
    &-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
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
</style>
