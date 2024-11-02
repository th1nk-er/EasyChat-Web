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
      <template v-if="isMessageVisible(item)">
        <!-- 显示时间 -->
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
        <!-- 命令消息 -->
        <div
          class="message-container-item-command"
          v-if="item.messageType == MessageType.COMMAND"
        >
          <!-- 用户邀请进群 -->
          <div
            class="command-group-invitation"
            v-if="item.content == MessageCommand.GROUP_INVITED"
          >
            <p>
              <span
                class="primary link"
                @click="showUserInfo(Number(getMessageCommandParams(item)[0]))"
                >{{
                  getMemberNickname(Number(getMessageCommandParams(item)[0]))
                }}</span
              >
              <span>邀请</span>
              <span
                class="primary link"
                @click="showUserInfo(Number(getMessageCommandParams(item)[1]))"
                >{{
                  getMemberNickname(Number(getMessageCommandParams(item)[1]))
                }}</span
              >
              <span>加入了群聊</span>
            </p>
          </div>
        </div>
        <!-- 文本消息和图片消息 -->
        <div
          v-if="
            item.messageType == MessageType.TEXT ||
            item.messageType == MessageType.IMAGE
          "
          :class="
            item.senderId == userStore.userInfo.id ? 'item-right' : 'item-left'
          "
        >
          <!-- 用户头像 -->
          <img
            :src="getUserAvatarUrl(item.senderId)"
            class="message-container-item-avatar"
            @click="showUserInfo(item.senderId)"
          />
          <!-- 文本消息 -->
          <div
            class="message-container-item-content"
            v-if="item.messageType == MessageType.TEXT"
          >
            <!-- 用户群昵称 -->
            <p
              v-if="chatInfo.chatType == ChatType.GROUP"
              class="message-container-item-content-nickname"
            >
              {{ memberInfo.get(item.senderId)?.userGroupNickname }}
            </p>
            <!-- 消息内容 -->
            <p class="message-container-item-content-text">
              {{ item.content }}
            </p>
          </div>
          <!-- 图片消息 -->
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
      </template>
    </div>
    <el-dialog
      v-model="previewImgShow"
      :align-center="true"
      style="display: flex; justify-content: center; padding: 10px"
      :fullscreen="true"
      @click="previewImgShow = false"
    >
      <img w-full :src="previewImgSrc" style="max-width: 100%" />
    </el-dialog>
    <UserInfoDialog v-model="userInfoDialogShow" />
    <FriendInfoDialog v-model="friendInfoDialogShow" :friend-id="userInfoId" />
    <GroupMemberInfoDialog
      v-model="groupMemberInfoDialogShow"
      :group-id="chatInfo.chatId"
      :user-id="userInfoId"
      @onMemberIgnoreChanged="handleMemberIgnoreChanged"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ChatType,
  type ChatMessage,
  MessageType,
  MessageCommand,
} from '@/api/chat/types';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import { getTimeString } from '@/utils/timeUtils';
import UserInfoDialog from '@/components/user/UserInfoDialog.vue';
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';
import type { ChatInfo } from '.';
import { useGroupStore } from '@/stores/group';
import type {
  GroupMemberIgnoredVo,
  GroupMemberInfoVo,
} from '@/api/group/types';
import { getMessageCommandParams } from '@/utils/chat';
import { getGroupIgnored } from '@/api/group';

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
const groupStore = useGroupStore();
const memberInfo = ref<Map<Number, GroupMemberInfoVo>>(new Map());
const ignoredMembers = ref([] as GroupMemberIgnoredVo[]);
onMounted(async () => {
  if (props.chatInfo.chatType == ChatType.GROUP) {
    const resp = await getGroupIgnored(
      userStore.userInfo.id,
      props.chatInfo.chatId
    );
    ignoredMembers.value = resp.data;
  }
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
watch(
  () => props.messageData.length,
  () => {
    // 获取群成员信息
    if (props.chatInfo.chatType == ChatType.GROUP) {
      props.messageData.forEach(async (msg) => {
        if (msg.senderId == -1) return;
        if (
          msg.senderId != userStore.userInfo.id &&
          memberInfo.value.get(msg.senderId) == undefined
        ) {
          memberInfo.value.set(msg.senderId, {} as GroupMemberInfoVo);
          let info = await groupStore.getMemberInfo(
            props.chatInfo.chatId,
            msg.senderId
          );
          if (info) {
            if (info.userGroupNickname && info.userGroupNickname.length > 0)
              memberInfo.value.set(msg.senderId, info);
            else {
              info.userGroupNickname = info.username;
            }
            memberInfo.value.set(msg.senderId, info);
          }
        }
      });
    }
  }
);
const getUserAvatarUrl = (userId: number) => {
  if (userId == userStore.userInfo.id) {
    return getFileUrl(userStore.userInfo.avatar);
  } else if (props.chatInfo.chatType == ChatType.FRIEND) {
    return getFileUrl(props.chatInfo.avatar);
  } else if (props.chatInfo.chatType == ChatType.GROUP) {
    return getFileUrl(memberInfo.value.get(userId)?.avatar);
  }
};
const userInfoId = ref(0);
const userInfoDialogShow = ref(false);
const friendInfoDialogShow = ref(false);
const groupMemberInfoDialogShow = ref(false);
const showUserInfo = (id: number) => {
  userInfoId.value = id;
  if (id == userStore.userInfo.id) {
    userInfoDialogShow.value = true;
  } else {
    if (props.chatInfo.chatType == ChatType.FRIEND) {
      friendInfoDialogShow.value = true;
    } else if (props.chatInfo.chatType == ChatType.GROUP) {
      groupMemberInfoDialogShow.value = true;
    }
  }
};
const getMemberNickname = (userId: number) => {
  const member = groupStore.groupMemberList.find(
    (member) => member.userId == userId
  );
  if (member) {
    if (member.userGroupNickname && member.userGroupNickname.length > 0)
      return member.userGroupNickname;
    else return member.username;
  } else {
    groupStore.getMemberInfo(props.chatInfo.chatId, userId);
  }
};

const handleMemberIgnoreChanged = (newVal: boolean) => {
  if (newVal) {
    ignoredMembers.value.push({
      ignoredId: userInfoId.value,
      groupId: props.chatInfo.chatId,
      userId: userStore.userInfo.id,
      createTime: new Date().toISOString(),
    });
  } else {
    ignoredMembers.value = ignoredMembers.value.filter(
      (item) => item.ignoredId != userInfoId.value
    );
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
    &-command {
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
      display: flex;
      flex-direction: column;
      max-width: 55%;
      &-nickname {
        color: var(--color-subtitle);
      }
      &-text {
        border-radius: 5px;
        padding: 3px 8px;
        font-size: 1.2rem;
        background-color: var(--color-background-mute);
        text-wrap: wrap;
        white-space: pre-wrap; /* 保留空格，允许换行 */
        word-break: break-all; /* 允许单词内部断开 */
      }
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
      .message-container-item-content-text {
        color: black;
        background-color: rgb(149, 236, 105);
      }
    }
  }
}
</style>
