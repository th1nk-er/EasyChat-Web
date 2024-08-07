<template>
  <div class="container">
    <div class="chat-list">
      <ToolBar />
      <div
        class="chat-list-box"
        v-infinite-scroll="loadConversations"
        :infinite-scroll-disabled="scrollDisabled"
      >
        <div v-for="(user, key) in data" :key="key" class="user-item">
          <div class="user-item__avatar-box">
            <el-badge
              :value="user.unreadCount"
              :max="99"
              class="item"
              :show-zero="false"
              :is-dot="user.muted && user.unreadCount > 0"
              :offset="[-3, 3]"
              :badge-style="user.muted ? { width: '13px', height: '13px' } : ''"
            >
              <img
                :src="getAvatarUrl(user.avatar)"
                class="user-item__avatar-box__img-avatar"
              />
            </el-badge>
          </div>
          <div class="user-item__content">
            <div class="user-item__content__text">
              <p
                class="user-item__content__text-name"
                v-if="user.remark == undefined"
              >
                {{ user.nickname }}
              </p>
              <p class="user-item__content__text-name" v-else>
                {{ user.remark }}
              </p>
              <p class="user-item__content__text-part-message">
                {{ user.lastMessage }}
              </p>
            </div>
            <div class="user-item__content__info">
              <p class="user-item__content__info-time">
                {{ getTimeString(user.updateTime) }}
              </p>
              <IconNotificationOff
                class="user-item__content__info-muted"
                v-if="user.muted"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChatInstance />
  </div>
</template>
<script setup lang="ts">
import { ToolBar } from "../../components";
import { useChatStore } from "@/stores/chat";
import { ChatInstance } from "./components";
import { getUserConversationList } from "@/api/chat";
import type { UserConversation } from "@/api/chat/types";
import { getTimeString } from "@/utils/timeUtils";
import { getAvatarUrl } from "@/utils/userUtils";

const chatStore = useChatStore();

const data = reactive([] as UserConversation[]);
const currentPage = ref(1);
const scrollDisabled = ref(false);
const loadConversations = async () => {
  const resp = await getUserConversationList(currentPage.value);
  if (resp.data.length == 0) {
    scrollDisabled.value = true;
  }
  currentPage.value++;
  data.push(...resp.data);
  chatStore.unread = getUnreadCount();
};
const getUnreadCount = () => {
  let res = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].unreadCount > 0) {
      if (data[i].muted) res++;
      else res += data[i].unreadCount;
    }
  }
  return res;
};
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  display: flex;
}
.chat-list {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 100vh;
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
