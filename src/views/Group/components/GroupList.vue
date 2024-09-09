<template>
  <div class="container">
    <div class="group-item" @click="groupInvitationDialogVisible = true">
      <IconGroup class="group-item__avatar svg" />
      <div class="group-item__name">
        <span>邀请列表</span>
      </div>
    </div>
    <div
      class="group-item"
      v-for="(item, index) in groupStore.groupList"
      :key="index"
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
    <GroupInvitationDialog v-model="groupInvitationDialogVisible" />
  </div>
</template>
<script setup lang="ts">
import { useGroupStore } from '@/stores/group';
import { getFileUrl } from '@/utils/file';
import { GroupInvitationDialog } from '.';
const groupStore = useGroupStore();
const groupInvitationDialogVisible = ref(false);
onMounted(() => {
  groupStore.loadGroupList();
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
