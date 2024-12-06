<template>
  <el-dialog v-model="dialogVisible" title="修改邮箱" width="35%">
    <el-form ref="formRef" :model="formData" label-width="auto" :rules="rules">
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
      <el-form-item label="新邮箱" prop="newEmail">
        <el-input v-model="formData.newEmail" />
      </el-form-item>
      <el-form-item label="再次输入邮箱" prop="repeatEmail">
        <el-input v-model="formData.repeatEmail" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangeEmail">
          确认修改
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { sendChangeEmailCode, updateUserEmail } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { useWSStore } from '@/stores/ws';
import type { FormInstance, FormRules } from 'element-plus';

const dialogVisible = defineModel({ type: Boolean, default: false });
const userStore = useUserStore();
const wsStore = useWSStore();
const router = useRouter();
const formRef = ref<FormInstance>();
const formData = ref({
  oldEmail: userStore.userInfo.email,
  newEmail: '',
  repeatEmail: '',
  code: '',
});
const rules = reactive<FormRules<typeof formData>>({
  newEmail: [
    { required: true, message: '请输入新邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
  repeatEmail: [
    { required: true, message: '请再次输入邮箱', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.value.newEmail) {
          callback(new Error('两次输入的邮箱不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});
const handleSendEmail = async () => {
  await sendChangeEmailCode();
  sendDisabled.value = true;
  sendSeconds.value = 60;
  ElMessage.success('验证码发送成功');
};
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
const handleChangeEmail = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      await updateUserEmail(
        userStore.userInfo.id,
        formData.value.code,
        formData.value.newEmail
      );
      ElMessage.success('邮箱修改成功');
      dialogVisible.value = false;
      wsStore.stompClient.deactivate();
      userStore.removeToken();
      router.push({ name: 'Login' });
    }
  });
};
</script>
<style scoped lang="scsss"></style>
