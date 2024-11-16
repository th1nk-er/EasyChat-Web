<template>
  <el-dialog v-model="dialogVisible" title="禁言" width="20%" top="35vh">
    <template class="mute-box">
      <el-select v-model="muteMinutes" placeholder="请选择">
        <el-option label="1分钟" :value="1" />
        <el-option label="10分钟" :value="10" />
        <el-option label="30分钟" :value="30" />
        <el-option label="1小时" :value="60" />
        <el-option label="12小时" :value="60 * 12" />
        <el-option label="24小时" :value="60 * 24" />
        <el-option label="3天" :value="60 * 24 * 3" />
        <el-option label="7天" :value="60 * 24 * 7" />
        <el-option label="30天" :value="60 * 24 * 30" />
        <el-option label="自定义时长" :value="-1" />
      </el-select>
      <el-input-number
        v-show="muteMinutes == -1"
        v-model="muteMinutesInput"
        :min="1"
        :max="60 * 24 * 30"
        placeholder="请输入禁言时长(分钟)"
      />
      <div class="button-group">
        <el-button type="primary" @click="handleMuteMember">禁言</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
const dialogVisible = defineModel({ type: Boolean, default: false });
const emit = defineEmits<{
  onMemberMute: [minutes: number];
}>();
const muteMinutes = ref(1);
const muteMinutesInput = ref(1);
const handleMuteMember = () => {
  if (muteMinutes.value == -1) {
    if (muteMinutesInput.value == 0) {
      return;
    }
    emit('onMemberMute', muteMinutesInput.value);
  } else {
    emit('onMemberMute', muteMinutes.value);
  }
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.mute-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .button-group {
    display: flex;
    justify-content: space-between;
  }
}
</style>
