<template>
  <div class="main" v-infinite-scroll="loadChatList">
    <div v-for="(user, key) in loadedData" :key="key" class="user-item">
      <div class="user-item__avatar-box">
        <el-badge
          :value="user.unread"
          :max="99"
          class="item"
          :show-zero="false"
          :is-dot="user.muted && user.unread > 0"
          :offset="[-3, 3]"
          :badge-style="user.muted ? { width: '13px', height: '13px' } : ''"
        >
          <img :src="user.avatar" class="user-item__avatar-box__img-avatar" />
        </el-badge>
      </div>
      <div class="user-item__content">
        <div class="user-item__content__text">
          <p class="user-item__content__text-name">{{ user.name }}</p>
          <p class="user-item__content__text-part-message">
            {{ user.partMessage }}
          </p>
        </div>
        <div class="user-item__content__info">
          <p class="user-item__content__info-time">{{ user.time }}</p>
          <IconNotificationOff
            class="user-item__content__info-muted"
            v-if="user.muted"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();

const data = reactive([
  {
    avatar: "https://avatars.githubusercontent.com/u/69061641?v=4",
    name: "th1nk",
    partMessage: "abcdefg1234567890",
    time: "19:21",
    unread: 100,
    muted: false,
  },
]);
const loadedData = reactive([] as any[]);
// 添加测试数据
const addTestData = () => {
  for (let i = 0; i < 100; i++) {
    data.push({
      avatar: `https://avatars.githubusercontent.com/u/${69061642 + i}?v=4`,
      name: window.crypto.randomUUID(),
      partMessage: window.crypto.getRandomValues(new Uint8Array(30)).join(""),
      time: "19:21",
      unread: Math.random() > 0.5 ? Math.round(Math.random() * 20) : 0,
      muted: Math.random() > 0.5 ? true : false,
    });
  }
};
const getUnreadCount = () => {
  let res = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].unread > 0) {
      if (data[i].muted) res++;
      else res += data[i].unread;
    }
  }
  return res;
};
onMounted(() => {
  addTestData();
  chatStore.unread = getUnreadCount();
});

const loadChatList = () => {
  if (data.length == loadedData.length) return;
  const len = loadedData.length;
  const appendCount = len + 15 > data.length ? data.length - len : 15;
  const newData = data.slice(len, len + appendCount);
  loadedData.push(...newData);
};
</script>
<style scoped lang="scss">
.main {
  height: 100%;
  max-width: 400px;
  min-width: 200px;
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
</style>
