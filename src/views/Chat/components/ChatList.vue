<template>
  <div class="chat-list">
    <TopSearchBar />
    <div class="chat-list-box">
      <div
        v-for="(conversation, key) in chatStore.conversationList"
        :key="key"
        class="user-item"
        @click="handleClickConversation(conversation)"
      >
        <div class="user-item__avatar-box">
          <el-badge
            :value="conversation.unreadCount"
            :max="99"
            class="item"
            :show-zero="false"
            :is-dot="conversation.muted && conversation.unreadCount > 0"
            :offset="[-3, 3]"
            :badge-style="
              conversation.muted ? { width: '13px', height: '13px' } : ''
            "
          >
            <img
              :src="getFileUrl(conversation.avatar)"
              class="user-item__avatar-box__img-avatar"
            />
          </el-badge>
        </div>
        <div class="user-item__content">
          <div class="user-item__content__text">
            <p
              class="user-item__content__text-name"
              v-if="
                conversation.remark == undefined ||
                conversation.remark.length == 0
              "
            >
              {{ conversation.nickname }}
            </p>
            <p class="user-item__content__text-name" v-else>
              {{ conversation.remark }}
            </p>
            <p class="user-item__content__text-part-message">
              <span v-if="conversation.messageType == MessageType.TEXT">
                {{ conversation.lastMessage }}
              </span>
              <span v-if="conversation.messageType == MessageType.IMAGE">
                [图片]
              </span>
            </p>
          </div>
          <div class="user-item__content__info">
            <p class="user-item__content__info-time">
              {{ getTimeString(conversation.updateTime) }}
            </p>
            <IconNotificationOff
              class="user-item__content__info-muted"
              v-if="conversation.muted"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TopSearchBar from '@/components/common/TopSearchBar.vue';
import { useChatStore } from '@/stores/chat';
import { MessageType, type UserConversation } from '@/api/chat/types';
import { getTimeString } from '@/utils/timeUtils';
import { getFileUrl } from '@/utils/file';

const chatStore = useChatStore();
const handleClickConversation = (conversation: UserConversation) => {
  chatStore.clearConversationUnread(conversation.chatId, conversation.chatType);
  chatStore.chatId = conversation.chatId;
  chatStore.chatType = conversation.chatType;
  chatStore.isChatting = true;
};
onMounted(() => {
  chatStore.loadConversations();
});
</script>
<style scoped lang="scss">
.chat-list {
  display: flex;
  flex-direction: column;
  min-width: 400px;
  height: 100%;
  &-box {
    flex-grow: 1;
    width: 100%;
    background-color: var(--color-background-mute);
    display: flex;
    flex-direction: column;
    overflow: auto;

    .user-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--color-border-mute);
      cursor: pointer;

      &:hover {
        background-color: var(--color-background-soft);
      }

      &__avatar-box {
        padding: 10px 7px;
        margin-right: 5px;

        &__img-avatar {
          width: 48px;
          height: 48px;
          border-radius: 8px;
        }
      }

      &__content {
        padding: 5px 10px;
        height: 100%;
        max-width: 85%;
        flex-grow: 1;
        display: flex;
        border-bottom: 1px solid var(--color-border);

        &__text {
          flex-grow: 1;
          display: flex;
          width: 65%;
          flex-direction: column;
          justify-content: space-between;

          &-name {
            color: var(--color-heading);
            font-weight: bolder;
            overflow: hidden;
            text-wrap: nowrap;
            text-overflow: ellipsis;
            max-width: 200px;
          }

          &-part-message {
            width: 100%;
            color: var(--color-subtitle);
            overflow: hidden;
            text-wrap: nowrap;
            text-overflow: ellipsis;
            max-width: 260px;
          }
        }
        &__info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;

          &-time {
            color: var(--color-subtitle);
          }

          &-muted {
            width: 15px;
            height: 15px;
            fill: var(--color-subtitle);
          }
        }
      }
    }
  }
}
</style>
