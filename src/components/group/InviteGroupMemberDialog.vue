<template>
  <el-dialog v-model="dialogVisible" title="邀请成员">
    <FriendSelectList
      :key="componentKey"
      ref="friendSelector"
      :selected-friend="props.memberList.map((item) => item.userId)"
      :disabled="true"
      @onFriendSelected="
        (friendVo: UserFriendVo) => {
          selectedFriends.push(friendVo.friendId);
        }
      "
      @OnFriendSelectedCancel="
        (friendVo: UserFriendVo) => {
          selectedFriends.splice(selectedFriends.indexOf(friendVo.friendId), 1);
        }
      "
    />
    <p>已选择{{ selectedFriends.length }}人</p>
    <el-button type="primary" @click="handleInviteMember">邀请</el-button>
  </el-dialog>
</template>
<script setup lang="ts">
import type { GroupMemberInfoVo } from '@/api/group/types';
import FriendSelectList from '../friend/FriendSelectList.vue';
import type { UserFriendVo } from '@/api/friend/types';
import { inviteGroupMember } from '@/api/group';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const dialogVisible = defineModel({ type: Boolean });
const friendSelector = ref<typeof FriendSelectList | null>(null);
const componentKey = ref(0);
const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
  /**
   * 群聊中原有的成员列表
   */
  memberList: {
    type: Array<GroupMemberInfoVo>,
    required: true,
  },
});
const selectedFriends = ref<number[]>([]);
const handleInviteMember = async () => {
  if (selectedFriends.value.length == 0) return;
  await inviteGroupMember(
    userStore.userInfo.id,
    props.groupId,
    selectedFriends.value
  );
  ElMessage.success('邀请成功');
  dialogVisible.value = false;
};
watch(dialogVisible, (value) => {
  if (value) {
    selectedFriends.value = [];
    componentKey.value++;
  }
});
</script>
<style lang="scss" scoped></style>
