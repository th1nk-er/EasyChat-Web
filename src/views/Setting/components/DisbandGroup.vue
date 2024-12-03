<template>
  <el-dialog v-model="dialogVisible" title="解散群聊" width="500">
    <p>
      <span>你正在进行</span>
      <span style="font-weight: bolder">解散群聊</span>
      <span>操作</span>
    </p>
    <p>
      <span>请在下方输入</span>
      <span style="color: red; font-weight: bolder">{{ props.groupName }}</span>
      <span>进行确认操作</span>
    </p>
    <el-input v-model="input" placeholder="" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="danger"
          @click="handleDisbandGroup"
          :disabled="input != props.groupName"
          >解散</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { disbandGroup } from '@/api/group';
import { useGroupStore } from '@/stores/group';

const dialogVisible = defineModel({ type: Boolean });
const groupStore = useGroupStore();
const props = defineProps<{
  groupId: number;
  groupName: String;
}>();
const input = ref('');
const handleDisbandGroup = async () => {
  await disbandGroup(props.groupId);
  ElMessage.success('群组已解散');
  groupStore.loadGroupList(true);
  dialogVisible.value = false;
};
</script>
<style scoped lant="scss"></style>
