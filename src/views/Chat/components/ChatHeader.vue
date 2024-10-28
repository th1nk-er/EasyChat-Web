<template>
  <div class="chat__header">
    <div class="chat__header__title">
      <FriendInfoDialog
        v-if="chatInfo.chatType == ChatType.FRIEND"
        v-model="friendInfoDialogShow"
        :friend-id="chatInfo.chatId"
        @on-friend-info-update="onFriendInfoUpdate"
      />
      <GroupInfoDialog
        v-if="chatInfo.chatType == ChatType.GROUP"
        v-model="groupInfoDialogShow"
        :group-id="chatInfo.chatId"
        @on-group-info-update="onGroupInfoUpdate"
      />
      <div class="chat__header__title__name" @click="showInfo">
        <span
          v-if="chatInfo.remark == undefined || chatInfo.remark.length == 0"
          >{{ chatInfo.name }}</span
        >
        <span v-else>{{ chatInfo.remark }}</span>
        <span v-if="chatInfo.chatType == ChatType.GROUP"
          >({{ memberCount }})</span
        >
      </div>
      <IconNotificationOff
        class="chat__header__title__muted"
        v-if="chatInfo.muted"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';
import type { UserFriendVo } from '@/api/friend/types';
import { ChatType } from '@/api/chat/types';
import type { ChatInfo } from '.';
import GroupInfoDialog from '@/components/group/GroupInfoDialog.vue';
import type { GroupVo, UserGroupVo } from '@/api/group/types';
import { getGroupInfo } from '@/api/group';
const friendInfoDialogShow = ref(false);
const groupInfoDialogShow = ref(false);
const props = defineProps({
  chatInfo: {
    type: Object as PropType<ChatInfo>,
    required: true,
  },
});
const chatInfo = ref(props.chatInfo);
const groupInfo = ref({} as GroupVo);

const memberCount = computed(() => {
  if (groupInfo.value.memberCount == undefined) loadGroupInfo();
  return groupInfo.value.memberCount;
});
const loadGroupInfo = async () => {
  const resp = await getGroupInfo(chatInfo.value.chatId);
  groupInfo.value = resp.data;
};
const onFriendInfoUpdate = (data: UserFriendVo) => {
  chatInfo.value.chatId = data.friendId;
  chatInfo.value.name = data.nickname;
  chatInfo.value.remark = data.remark;
  chatInfo.value.avatar = data.avatar;
  chatInfo.value.muted = data.muted;
};
const showInfo = () => {
  if (chatInfo.value.chatType == ChatType.FRIEND)
    friendInfoDialogShow.value = true;
  else if (chatInfo.value.chatType == ChatType.GROUP)
    groupInfoDialogShow.value = true;
};
const onGroupInfoUpdate = (data: UserGroupVo) => {
  chatInfo.value.chatId = data.groupId;
  chatInfo.value.name = data.groupName;
  chatInfo.value.remark = data.groupRemark ?? '';
  chatInfo.value.avatar = data.avatar;
  chatInfo.value.muted = data.muted;
};
</script>
<style lang="scss" scoped>
.chat__header {
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;
  padding-right: 20px;
  border-bottom: 2px solid var(--color-border);

  &__title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &__name {
      font-weight: bolder;
      font-size: 20px;
      cursor: pointer;
      &:hover {
        // 添加下划线
        text-decoration: underline;
      }
    }
    &__muted {
      width: 20px;
      height: 20px;
      fill: var(--color-subtitle);
    }
  }
}
</style>
