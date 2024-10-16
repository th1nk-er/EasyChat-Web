<template>
  <el-dialog v-model="dialogVisible" title="修改群昵称" width="35%">
    <div class="container">
      <el-input
        v-model="nickname"
        placeholder="请输入用户群昵称"
        maxlength="20"
      />
      <div class="button-group">
        <el-button type="primary" @click="handleChangeUserGroupNickname"
          >修改</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { updateUserGroupNickname } from '@/api/group';
const dialogVisible = defineModel({ type: Boolean, default: false });
const props = defineProps({
  nickname: {
    type: String,
    default: '',
  },
  groupId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits<{
  onNicknameChanged: [nickname: string];
}>();
const nickname = ref('');
watch(dialogVisible, (value) => {
  if (value) {
    nickname.value = props.nickname;
  }
});
const handleChangeUserGroupNickname = async () => {
  if (!nickname.value || nickname.value === props.nickname) {
    dialogVisible.value = false;
    return;
  }
  if (nickname.value.length > 20) {
    return ElMessage.error('群昵称长度不能超过20个字符');
  }
  await updateUserGroupNickname(props.userId, props.groupId, nickname.value);
  emit('onNicknameChanged', nickname.value);
  ElMessage.success('修改成功');
  dialogVisible.value = false;
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
