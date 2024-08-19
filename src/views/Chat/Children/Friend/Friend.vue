<template>
  <div class="container">
    <ToolBar />
    <div class="main">
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
          v-for="(item, index) in friendStore.friendList"
          :key="index"
          @click="handleFriendClick(index)"
        >
          <img
            :src="getAvatarUrl(item.avatar)"
            class="friend-item__img-avatar"
          />
          <div class="friend-item__content">
            <span class="friend-item__title" v-if="item.remark != undefined">
              {{ item.remark }}
            </span>
            <span
              :class="
                item.remark == undefined
                  ? 'friend-item__title'
                  : 'friend-item__subtitle'
              "
              >{{ item.nickname }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <FriendInfoDialog
      v-model="friendInfoShow"
      :friend-info="selectedFriendInfo"
    />
  </div>
</template>
<script setup lang="ts">
import { getUserFriendList } from "@/api/friend";
import { ToolBar } from "../../components";
import { FriendRequestDialog } from "./components";
import type { FriendListVo, UserFriendVo } from "@/api/friend/types";
import { getAvatarUrl } from "@/utils/userUtils";
import FriendInfoDialog from "@/components/friend/FriendInfoDialog.vue";
import { UserSex } from "@/api/user/types";
import { useFriendStore } from "@/stores/friend";
const requestDialogShow = ref(false);
const friendStore = useFriendStore();
const currentPage = ref(1);
const scrollDisabled = ref(false);
const friendListVo = ref<FriendListVo>({
  total: 0,
  pageSize: 0,
  records: [],
});
const loadFriendList = async () => {
  const resp = await getUserFriendList(currentPage.value);
  if (resp.data.records.length > 0) {
    friendListVo.value.total = resp.data.total;
    friendListVo.value.pageSize = resp.data.pageSize;
    friendListVo.value.records.push(...resp.data.records);
    currentPage.value++;
    friendStore.friendList = friendListVo.value.records;
  }
  if (resp.data.records.length < resp.data.pageSize) {
    scrollDisabled.value = true;
    return;
  }
};

const friendInfoShow = ref(false);
const selectedFriendInfo = ref<UserFriendVo>({
  friendId: 0,
  nickname: "",
  username: "",
  avatar: "",
  sex: UserSex.SECRET,
  createTime: "",
  remark: "",
  muted: false,
});
const handleFriendClick = (index: number) => {
  selectedFriendInfo.value = friendStore.friendList[index];
  friendInfoShow.value = true;
};
</script>

<style scoped lang="scss">
.container {
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .main {
    flex-grow: 1;
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
    }

    .friend-item:hover {
      background-color: var(--color-background-soft);
    }
  }
}
</style>
