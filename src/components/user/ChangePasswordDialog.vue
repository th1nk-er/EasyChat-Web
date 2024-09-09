<template>
  <el-dialog v-model="dialogShow" width="30%" title="修改密码" align-center>
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="rules">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" disabled />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="formData.code" maxlength="6">
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
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="formData.newPassword"
          type="password"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="请重复密码" prop="repeatPassword">
        <el-input
          v-model="formData.repeatPassword"
          type="password"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleChangePassword(formRef)"
          >修改</el-button
        >
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { changePassword, sendChangePasswordEmail } from '@/api/user';
import type { UpdatePasswordParams } from '@/api/user/types';
import { useUserStore } from '@/stores/user';
import { useWSStore } from '@/stores/ws';
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const wsStore = useWSStore();
const dialogShow = defineModel({
  type: Boolean,
  default: false,
});
const formRef = ref<FormInstance>();
const formData = reactive({
  email: '',
  code: '',
  newPassword: '',
  repeatPassword: '',
});
const rules = reactive<FormRules<typeof formData>>({
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  repeatPassword: [
    { required: true, message: '请输入重复密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== formData.newPassword) {
          callback(new Error('两次输入密码不一致'));
        }
        callback();
      },
    },
  ],
});
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
const handleSendEmail = async () => {
  await sendChangePasswordEmail();
  ElMessage.success('验证码发送成功');
  sendSeconds.value = 60;
  sendDisabled.value = true;
};
const handleCancel = () => {
  dialogShow.value = false;
  formRef.value?.resetFields();
  formData.email = userStore.userInfo.email;
};

const handleChangePassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      await changePassword({
        userId: userStore.userInfo.id,
        code: formData.code,
        newPassword: formData.newPassword,
      } as UpdatePasswordParams);
      ElMessage.success('密码修改成功');
      wsStore.stompClient.deactivate();
      userStore.removeToken();
      router.push({ name: 'Login' });
    }
  });
};
onMounted(() => {
  formData.email = userStore.userInfo.email;
});
</script>
