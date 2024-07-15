<template>
  <el-form
    v-show="getShow"
    :model="formData"
    ref="formRef"
    class="form"
    :rules="rules"
  >
    <el-form-item prop="email">
      <el-input
        class="input"
        v-model="formData.email"
        :prefix-icon="IconEmail"
        placeholder="请输入邮箱"
      />
    </el-form-item>
    <el-form-item prop="verifyCode">
      <el-input
        class="input code"
        v-model="formData.verifyCode"
        :prefix-icon="IconKey"
        placeholder="请输入验证码"
      />
      <el-button class="button send" @click="sendEmail" :disabled="sendDisable"
        >发送验证码
        <p v-show="(sendSeconds = 0)">({{ sendSeconds }})</p></el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button
        class="button login"
        type="primary"
        @click="handleLogin(formRef)"
        >登录</el-button
      >
    </el-form-item>
    <el-link type="primary" :onClick="toPasswordLogin">密码登录</el-link>
  </el-form>
</template>
<script setup lang="ts">
import IconKey from "@/components/icons/IconKey.vue";
import IconEmail from "@/components/icons/IconEmail.vue";
import { LoginType, useLoginState } from "@/views/Login/components/userLogin";
import type { FormInstance, FormRules } from "element-plus";
import { login, sendVerifyCode } from "@/api/login";
import type { UserLoginVo } from "@/api/login/types";
import { useUserStore } from "@/stores/user";
const loginState = useLoginState();
const userStore = useUserStore();
const router = useRouter();
const getShow = computed(
  () => unref(loginState.getLoginType) === LoginType.EMAIL
);
const formRef = ref<FormInstance>();
const formData = reactive({
  email: "",
  verifyCode: "",
});

const toPasswordLogin = () => {
  loginState.backToPasswordLogin();
};
const rules = reactive<FormRules<typeof formData>>({
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      type: "email",
      message: "请输入正确的邮箱",
      trigger: ["blur", "change"],
    },
  ],
  verifyCode: [
    {
      required: true,
      min: 4,
      max: 6,
      message: "请输入正确的验证码",
      trigger: ["blur", "change"],
    },
  ],
});

const sendDisable = ref(false);
const sendSeconds = ref(0);
// 发送邮箱验证码
const sendEmail = async () => {
  sendDisable.value = true;
  if (
    !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(formData.email)
  ) {
    ElMessage.error("请输入正确的邮箱");
    sendDisable.value = false;
    return;
  }
  await sendVerifyCode({ email: formData.email });
  ElMessage.success("验证码发送成功");
  sendSeconds.value = 60;
};

watch(sendSeconds, (newValue) => {
  if (newValue > 0) {
    setTimeout(() => {
      sendSeconds.value--;
    }, 1000);
  } else {
    sendDisable.value = false;
  }
});

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      const userLoginVo = {
        type: LoginType.EMAIL,
        email: formData.email,
        verifyCode: formData.verifyCode,
      } as UserLoginVo;
      const resp = await login(userLoginVo);
      userStore.userToken = resp.data;
      ElMessage.success("登录成功");
      router.push({ name: "Chat" });
    }
  });
};
</script>
<style scoped lang="scss">
.form {
  border-radius: 10px;
  padding: 0 20px;
  background-color: var(--color-background);
  box-shadow: 8px 8px 2px 1px rgba(0, 0, 0, 0.2);
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 350px;

  .input {
    height: 38px;
    width: 300px;
  }
  .input.code {
    width: 200px;
  }
  .button {
    margin: 3px;
    height: 40px;
  }
  .button.login {
    width: 300px;
  }
  .button.send {
    margin: 0px;
    width: 100px;
  }
}
</style>
