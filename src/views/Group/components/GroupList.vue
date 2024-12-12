<template>
  <div class="container">
    <TopSearchBar @onSearch="handleSearchContent" />
    <div class="group-item" @click="groupInvitationDialogVisible = true">
      <IconGroup class="group-item__avatar svg" />
      <div class="group-item__name">
        <span>群通知</span>
      </div>
    </div>
    <div
      class="group-item"
      v-for="(item, index) in groupList"
      :key="index"
      v-show="item.status != GroupStatus.DISBAND"
      @click="
        groupInfoDialogVisible = true;
        groupId = item.groupId;
      "
    >
      <img :src="getFileUrl(item.avatar)" class="group-item__avatar" />
      <div class="group-item__name">
        <span
          v-if="item.groupRemark == undefined || item.groupRemark.length == 0"
          >{{ item.groupName }}</span
        >
        <span v-else>{{ item.groupRemark }}</span>
      </div>
      <div class="group-item__muted" v-if="item.muted">
        <IconNotificationOff />
      </div>
    </div>
    <GroupNotificationDialog v-model="groupInvitationDialogVisible" />
    <GroupInfoDialog v-model="groupInfoDialogVisible" :group-id="groupId" />
  </div>
</template>
<script setup lang="ts">
import { useGroupStore } from '@/stores/group';
import { getFileUrl } from '@/utils/file';
import { GroupNotificationDialog } from '.';
import GroupInfoDialog from '@/components/group/GroupInfoDialog.vue';
import { GroupStatus, type UserGroupVo } from '@/api/group/types';
const groupStore = useGroupStore();
const groupInvitationDialogVisible = ref(false);
const groupInfoDialogVisible = ref(false);
const groupList = ref<UserGroupVo[]>([]);
const groupId = ref(0);
const handleSearchContent = (content: string) => {
  groupList.value = groupStore.groupList.filter((item) => {
    return (
      item.groupName.includes(content) ||
      (item.groupRemark && item.groupRemark.includes(content))
    );
  });
};
onMounted(() => {
  groupStore.loadGroupList();
  groupList.value = groupStore.groupList;
});
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: var(--color-background-mute);
  display: flex;
  flex-direction: column;
  .group-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    width: 100%;
    cursor: pointer;
    transition: 0.5s;
    &:hover {
      background-color: var(--color-background-soft);
    }
    &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      margin: 10px 7px;
      &.svg {
        padding: 8px;
        fill: white;
        background-color: rgb(13, 187, 13);
      }
    }
    &__name {
      flex-grow: 1;
      span {
        font-weight: bolder;
        margin-left: 10px;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
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
}
</style>
