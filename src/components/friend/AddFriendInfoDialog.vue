<template>
  <el-dialog v-model="dialogVisible" title="附加信息" width="30%">
    <el-input
      type="textarea"
      v-model="addInfoText"
      placeholder="请输入附加消息"
      maxlength="50"
      aria-required="true"
      class="input-add-info"
    />
    <el-button type="primary" @click="handleAddFriend()">发送申请</el-button>
    <el-button @click="dialogVisible = false">取消</el-button>
  </el-dialog>
</template>
<script setup lang="ts">
import { sendAddRequest } from '@/api/friend';
import type { AddFriendParams } from '@/api/friend/types';
import { useUserStore } from '@/stores/user';

const dialogVisible = defineModel({ type: Boolean, default: false });
watch(
  () => dialogVisible.value,
  (val) => {
    if (val) {
      addInfoText.value = '';
    }
  }
);
const props = defineProps({
  addId: { type: Number, required: true },
});
const addInfoText = ref('');
const userStore = useUserStore();
const handleAddFriend = async () => {
  await sendAddRequest({
    userId: userStore.userInfo.id,
    addId: props.addId,
    addInfo: addInfoText.value,
  } as AddFriendParams);
  ElMessage.success('好友申请已发送');
  dialogVisible.value = false;
  addInfoText.value = '';
};
</script>
<style lang="scss" scoped></style>
