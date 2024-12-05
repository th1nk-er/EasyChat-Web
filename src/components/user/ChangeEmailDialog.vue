<template>
  <el-dialog v-model="dialogVisible" title="修改邮箱" width="35%">
    <el-form ref="formRef" :model="formData" label-width="auto">
      <el-form-item label="当前邮箱" prop="oldEmail">
        <el-input v-model="formData.oldEmail" disabled />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入验证码">
          <template #append>
            <el-button
              type="primary"
              @click="handleSendEmail"
              :disabled="sendDisabled"
              >获取验证码<span v-show="sendDisabled"
                >({{ sendSeconds }})</span
              ></el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="新邮箱" prop="oldEmail">
        <el-input v-model="formData.newEmail" />
      </el-form-item>
      <el-form-item label="再次输入邮箱" prop="oldEmail">
        <el-input v-model="formData.repeatEmail" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确认修改
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const dialogVisible = defineModel({ type: Boolean, default: false });
const userStore = useUserStore();
const formData = ref({
  oldEmail: userStore.userInfo.email,
  newEmail: '',
  repeatEmail: '',
  code: '',
});
const handleSendEmail = async () => {};
const sendDisabled = ref(false);
const sendSeconds = ref(0);
watch(sendSeconds, (newValue) => {
  if (newValue > 0) {
    setTimeout(() => {
      sendSeconds.value--;
    }, 1000);
  } else {
    sendDisabled.value = false;
  }
});
</script>
<style scoped lang="scsss"></style>
