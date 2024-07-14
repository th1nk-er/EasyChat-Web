<template>
  <el-form v-show="getShow" v-model="formData" class="form">
    <el-form-item>
      <el-input
        class="input"
        v-model="formData.username"
        :prefix-icon="IconAccount"
        placeholder="请输入用户名"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        class="input"
        v-model="formData.password"
        type="password"
        :prefix-icon="IconLock"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>
    <div class="tool">
      <el-checkbox label="记住我" v-model="rememberMe" />
      <el-link type="primary" :onClick="toRecoverPassword">忘记密码?</el-link>
    </div>
    <el-form-item>
      <div class="button-group">
        <el-button class="button" type="primary" :onClick="handleLogin"
          >登录</el-button
        >
        <el-button class="button" :onClick="toRegister">注册</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import IconAccount from "@/components/icons/IconAccount.vue";
import IconLock from "@/components/icons/IconLock.vue";
import { LoginType, useLoginState } from "./userLogin";
import { login } from "@/api/login";
import type { UserLoginVo } from "@/api/login/types";
import { useUserStore } from "@/stores/user";
const router = useRouter();
const loginState = useLoginState();
const userStore = useUserStore();
const getShow = computed(
  () => unref(loginState.getLoginType) === LoginType.PASSWORD
);

// 表单数据
const formData = reactive({
  username: "",
  password: "",
} as UserLoginVo);

// 记住我
const rememberMe = ref(false);

const toRecoverPassword = () => {
  // TODO 指向找回密码页面
  // router.push({name:"RecoverPassword"})
};

const toRegister = () => {
  router.push({ name: "Register" });
};

const formCheck = () => {
  if (formData.username.length < 3 || formData.username.length > 20) {
    ElMessage.error("用户名长度应在3-20之间");
    return false;
  }

  if (formData.password.length < 6 || formData.password.length > 20) {
    ElMessage.error("密码长度应在6-20之间");
    return false;
  }
  return true;
};

const handleLogin = async () => {
  if (!formCheck()) return;
  // TODO 登录
  const resp = await login(formData);
  userStore.userToken = resp.data;
  if (rememberMe.value)
    userStore.setLoginForm(formData.username, formData.password);
  else userStore.removeLoginForm();
};
</script>
<style scoped lang="scss">
.form {
  --width: 300px;
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

  .tool {
    display: flex;
    margin-bottom: 5px;
    width: var(--width);
    justify-content: space-between;
    align-items: center;
    height: 30px;
  }

  .input {
    height: 38px;
    width: var(--width);
  }
  .button-group {
    display: flex;
    flex-direction: column;
    .button {
      margin: 3px;
      height: 40px;
      width: var(--width);
    }
  }
}
</style>
