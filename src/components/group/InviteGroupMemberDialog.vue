<template>
  <el-dialog v-model="dialogVisible" title="邀请成员">
    <FriendSelectList
      ref="friendSelector"
      :selected-friend="props.memberList.map((item) => item.userId)"
      :disabled="true"
    />
  </el-dialog>
</template>
<script setup lang="ts">
import type { GroupMemberInfoVo } from '@/api/group/types';
import FriendSelectList from '../friend/FriendSelectList.vue';
const dialogVisible = defineModel({ type: Boolean });
const friendSelector = ref<typeof FriendSelectList | null>(null);
const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
  memberList: {
    type: Array<GroupMemberInfoVo>,
    required: true,
  },
});
//TODO 邀请新成员
</script>
<style lang="scss" scoped></style>
