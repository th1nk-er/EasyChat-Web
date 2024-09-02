<template>
  <div class="container">
    <div class="member-select">
      <el-input
        v-model="searchContent"
        placeholder="输入查找关键字"
        infinite-scroll-disabled="scrollDisabled"
        class="input-search"
        maxlength="20"
      >
        <template #prefix>
          <IconSearch class="icon-search" />
        </template>
      </el-input>
      <div class="friend-list">
        <div
          class="friend-item"
          v-for="(item, index) in dataList"
          :key="index"
          @click="handleFriendSelect(friendList.indexOf(item))"
        >
          <img class="friend-item__avatar" :src="getFileUrl(item.avatar)" />
          <div class="friend-item__name">
            <span v-if="item.remark != undefined && item.remark.length > 0">{{
              item.remark
            }}</span>
            <span v-else>{{ item.nickname }}</span>
            <span>({{ item.username }})</span>
          </div>
          <input
            class="checkbox"
            type="checkbox"
            :checked="checkList[friendList.indexOf(item)]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getUserFriendList } from "@/api/friend";
import type { UserFriendVo } from "@/api/friend/types";
import { getFileUrl } from "@/utils/file";
const emit = defineEmits<{
  onFriendSelected: [UserFriendVo];
  onFriendSelectedCancel: [UserFriendVo];
}>();
const page = ref(1);
const friendList = ref([] as UserFriendVo[]);
const dataList = ref([] as UserFriendVo[]);
const searchContent = ref("");
watch(searchContent, (value) => {
  dataList.value = friendList.value.filter(
    (item) =>
      item.remark.includes(value) ||
      item.nickname.includes(value) ||
      item.username.includes(value)
  );
});
const checkList = ref<Array<boolean>>([]);
const handleFriendSelect = (index: number) => {
  checkList.value[index] = !checkList.value[index];
  if (checkList.value[index]) emit("onFriendSelected", dataList.value[index]);
  else emit("onFriendSelectedCancel", dataList.value[index]);
};
const loadData = () => {
  const intervalId = setInterval(async () => {
    const resp = await getUserFriendList(page.value++);
    if (resp.data.records.length < resp.data.pageSize) {
      clearInterval(intervalId);
      dataList.value = friendList.value;
      checkList.value = friendList.value.map(() => false);
    }
    friendList.value.push(...resp.data.records);
  }, 300);
};
onMounted(() => {
  loadData();
});
const selectCancel = (friend: UserFriendVo) => {
  checkList.value[friendList.value.indexOf(friend)] = false;
};
defineExpose({ selectCancel });
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  .member-select {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-right: 2px solid var(--color-border);
    padding: 5px;
    .input-search {
      .icon-search {
        fill: var(--color-subtitle);
      }
    }
    .friend-list {
      flex-grow: 1;
      margin-top: 10px;
      overflow-y: scroll;
      .friend-item {
        padding: 5px;
        display: flex;
        gap: 5px;
        align-items: center;
        transition: all 0.3s;
        &:hover {
          background-color: var(--color-background-mute);
        }

        &__avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        &__name {
          flex-grow: 1;
          span {
            font-weight: bold;
          }
        }
        .checkbox {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
</style>
