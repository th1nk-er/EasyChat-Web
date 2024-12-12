<template>
  <div class="main">
    <TopSearchBar @onSearch="handleSearchContent" />
    <FriendRequestDialog v-model="requestDialogShow" />
    <div class="friend-item" @click="requestDialogShow = true">
      <IconPersonFill
        class="friend-item__img-avatar svg"
        style="background-color: orange; fill: white"
      />
      <p class="friend-item__title">新朋友</p>
    </div>
    <div
      class="friend-list"
      v-infinite-scroll="loadFriendList"
      :infinite-scroll-disabled="scrollDisabled"
    >
      <div
        class="friend-item"
        v-for="(item, index) in friendList"
        :key="index"
        @click="handleFriendClick(index)"
      >
        <img :src="getFileUrl(item.avatar)" class="friend-item__img-avatar" />
        <div class="friend-item__content">
          <span
            class="friend-item__title"
            v-if="item.remark != undefined && item.remark.length > 0"
          >
            {{ item.remark }}
          </span>
          <span
            :class="
              item.remark == undefined || item.remark.length == 0
                ? 'friend-item__title'
                : 'friend-item__subtitle'
            "
            >{{ item.nickname }}</span
          >
        </div>
        <div class="friend-item__muted" v-if="item.muted">
          <IconNotificationOff />
        </div>
      </div>
    </div>
  </div>
  <FriendInfoDialog v-model="friendInfoShow" :friend-id="selectedFriendId" />
</template>
<script setup lang="ts">
import type { FriendListVo, UserFriendVo } from '@/api/friend/types';
import { useFriendStore } from '@/stores/friend';
import { getUserFriendList } from '@/api/friend';
import { getFileUrl } from '@/utils/file';
import { FriendRequestDialog } from '.';
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';
import { useUserStore } from '@/stores/user';
const friendStore = useFriendStore();
const userStore = useUserStore();
const requestDialogShow = ref(false);
const currentPage = ref(1);
const scrollDisabled = ref(false);
const friendListVo = ref<FriendListVo>({
  total: 0,
  pageSize: 0,
  records: [],
});
const friendList = ref<UserFriendVo[]>([]);
const friendInfoShow = ref(false);
const selectedFriendId = ref(0);
const loadFriendList = async () => {
  const resp = await getUserFriendList(
    userStore.userInfo.id,
    currentPage.value
  );
  if (resp.data.records.length > 0) {
    friendListVo.value.total = resp.data.total;
    friendListVo.value.pageSize = resp.data.pageSize;
    friendListVo.value.records.push(...resp.data.records);
    currentPage.value++;
    friendStore.friendList = friendListVo.value.records;
    friendList.value = friendStore.friendList;
  }
  if (resp.data.records.length < resp.data.pageSize) {
    scrollDisabled.value = true;
    return;
  }
};
const handleFriendClick = (index: number) => {
  selectedFriendId.value = friendStore.friendList[index].friendId;
  friendInfoShow.value = true;
};
const handleSearchContent = (content: string) => {
  friendList.value = friendStore.friendList.filter((item) => {
    return item.remark?.includes(content) || item.nickname.includes(content);
  });
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  background-color: var(--color-background-mute);
  display: flex;
  flex-direction: column;

  .friend-list {
    flex-grow: 1;
  }
  .friend-item {
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    transition: 0.5s;
    cursor: pointer;

    &__img-avatar {
      border-radius: 8px;
      margin: 10px 7px;
      width: 40px;
      height: 40px;
      &.svg {
        padding: 8px;
      }
    }
    &__content {
      flex-grow: 1;
    }
    &__title {
      flex-grow: 1;
      font-weight: bolder;
      margin-left: 10px;
      text-wrap: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &__subtitle {
      margin-left: 5px;
      color: var(--color-subtitle);
    }
    &__muted {
      margin-right: 10px;
      svg {
        fill: var(--color-subtitle);
        width: 18px;
        height: 18px;
      }
    }
  }

  .friend-item:hover {
    background-color: var(--color-background-soft);
  }
}
</style>
