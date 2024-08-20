<template>
  <el-form
    ref="formRef"
    :model="formData"
    class="login-form"
    v-show="getShow"
    :rules="rules"
  >
    <el-form-item class="login-form-item" prop="username">
      <el-input
        v-model="formData.username"
        placeholder="用户名"
        maxlength="20"
        :prefix-icon="IconPerson"
      />
    </el-form-item>
    <el-form-item class="login-form-item" prop="password">
      <el-input
        v-model="formData.password"
        :prefix-icon="IconLock"
        type="password"
        placeholder="请输入密码"
        show-password
        maxlength="20"
        @keydown.enter="handleLogin(formRef)"
      />
    </el-form-item>
    <div class="login-options">
      <el-checkbox label="记住我" v-model="rememberMe" />
    </div>
    <el-form-item class="login-form-item button-group">
      <el-button
        type="primary"
        class="login-form-item__button-login"
        @click="handleLogin(formRef)"
        >登录</el-button
      >
      <el-button class="login-form-item__button-register" @click="toRegister"
        >注册</el-button
      >
    </el-form-item>
    <el-link type="primary" @click="toEmailLogin">邮箱登录</el-link>
  </el-form>
</template>
<script setup lang="ts">
import IconPerson from "@/components/icons/IconPerson.vue";
import IconLock from "@/components/icons/IconLock.vue";
import { LoginType, useLoginState } from "./userLogin";
import { login } from "@/api/login";
import type { UserLoginVo } from "@/api/login/types";
import { useUserStore } from "@/stores/user";
import type { FormInstance, FormRules } from "element-plus";
const router = useRouter();
const loginState = useLoginState();
const userStore = useUserStore();
const getShow = computed(
  () => unref(loginState.getLoginType) === LoginType.PASSWORD
);

const formRef = ref<FormInstance>();
// 表单数据
const formData = reactive({
  username: "",
  password: "",
} as UserLoginVo);

const rules = reactive<FormRules<typeof formData>>({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
    {
      pattern: /^[a-zA-Z0-9_-]{3,20}$/,
      message: "只能包含字母、数字、下划线、减号, 长度在3-20个字符之间",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      max: 20,
      message: "密码长度在6-20个字符之间",
    },
  ],
});
// 记住我
const rememberMe = ref(false);
const toRegister = () => {
  router.push({ name: "Register" });
};

const toEmailLogin = () => {
  loginState.toEmailLogin();
};
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      const resp = await login(formData);
      userStore.userToken = resp.data;
      if (rememberMe.value)
        userStore.setLoginForm(formData.username, formData.password);
      else userStore.removeLoginForm();
      ElMessage.success("登录成功");
      router.push({ name: "ChatList" });
    }
  });
};
onMounted(() => {
  if (userStore.getLoginForm && userStore.getLoginForm.rememberMe) {
    formData.username = userStore.getLoginForm.username;
    formData.password = userStore.getLoginForm.password;
    rememberMe.value = true;
  }
});
</script>
<style scoped lang="scss">
.login-form {
  background-color: var(--color-background);
  padding: 30px 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.8;

  &-item {
    width: 330px;

    .button-group {
      display: flex;
      flex-direction: column;
    }
    &__button-login,
    &__button-register {
      margin: 2px;
      width: 100%;
    }
  }

  .login-options {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
