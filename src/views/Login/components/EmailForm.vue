<template>
  <el-form
    v-show="getShow"
    :model="formData"
    ref="formRef"
    class="login-form"
    :rules="rules"
  >
    <el-form-item prop="email" class="login-form-item">
      <el-input
        class="login-form-item__input-email"
        v-model="formData.email"
        :prefix-icon="IconEmail"
        placeholder="请输入邮箱"
        maxlength="30"
      />
    </el-form-item>
    <el-form-item prop="verifyCode" class="login-form-item">
      <div class="code-container">
        <el-input
          class="code-container__input-code"
          v-model="formData.verifyCode"
          :prefix-icon="IconKey"
          placeholder="请输入验证码"
          maxlength="6"
          @keydown.enter="handleLogin(formRef)"
        />
        <el-link
          class="code-container__link-code"
          @click="sendEmail"
          :disabled="sendDisabled"
          type="primary"
          >获取验证码
          <span v-show="sendSeconds > 0">({{ sendSeconds }})</span></el-link
        >
      </div>
    </el-form-item>
    <el-form-item class="login-form-item">
      <el-button
        class="login-form-item__button-login"
        type="primary"
        @click="handleLogin(formRef)"
        >登录</el-button
      >
    </el-form-item>
    <el-link type="primary" :onClick="toPasswordLogin">密码登录</el-link>
  </el-form>
</template>
<script setup lang="ts">
import IconKey from '@/components/icons/IconKey.vue';
import IconEmail from '@/components/icons/IconEmail.vue';
import { LoginType, useLoginState } from '@/views/Login/components/userLogin';
import type { FormInstance, FormRules } from 'element-plus';
import { login, sendVerifyCode } from '@/api/login';
import { getUserInfo } from '@/api/user';
import type { UserLoginVo } from '@/api/login/types';
import { useUserStore } from '@/stores/user';
import { isValidEmail } from '@/utils/validate';
import { useChatStore } from '@/stores/chat';
import { useFriendStore } from '@/stores/friend';
import { useGroupStore } from '@/stores/group';
const loginState = useLoginState();
const userStore = useUserStore();
const router = useRouter();
const getShow = computed(
  () => unref(loginState.getLoginType) === LoginType.EMAIL
);
const formRef = ref<FormInstance>();
const formData = reactive({
  email: '',
  verifyCode: '',
});

const toPasswordLogin = () => {
  loginState.backToPasswordLogin();
};
const rules = reactive<FormRules<typeof formData>>({
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '请输入正确的邮箱',
    },
  ],
  verifyCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
    {
      min: 4,
      max: 6,
      message: '请输入正确的验证码',
    },
  ],
});

const sendDisabled = ref(false);
const sendSeconds = ref(0);
// 发送邮箱验证码
const sendEmail = async () => {
  if (!isValidEmail(formData.email)) {
    ElMessage.error('请输入正确的邮箱');
    return;
  }
  await sendVerifyCode({ email: formData.email });
  ElMessage.success('验证码发送成功');
  sendDisabled.value = true;
  sendSeconds.value = 60;
};

watch(sendSeconds, (newValue) => {
  if (newValue > 0) {
    setTimeout(() => {
      sendSeconds.value--;
    }, 1000);
  } else {
    sendDisabled.value = false;
  }
});

const handleLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const userLoginVo = {
        type: LoginType.EMAIL,
        email: formData.email,
        verifyCode: formData.verifyCode,
      } as UserLoginVo;
      const resp = await login(userLoginVo);
      userStore.userToken = resp.data;
      ElMessage.success('登录成功');
      const chatStore = useChatStore();
      const friendStore = useFriendStore();
      const groupStore = useGroupStore();
      chatStore.conversationList = [];
      chatStore.loaded = false;
      friendStore.friendList = [];
      groupStore.groupList = [];
      groupStore.loaded = false;
      // 同步获取用户信息
      getUserInfo()
        .then((res) => {
          userStore.userInfo = res.data;
          router.push({ name: 'Chat' });
        })
        .catch(() => {
          userStore.removeToken();
          ElMessage.error('获取用户信息失败');
        });
    }
  });
};
</script>
<style scoped lang="scss">
.login-form {
  border-radius: 10px;
  padding: 30px 50px;
  background-color: var(--color-background);
  box-shadow: 8px 8px 2px 1px rgba(0, 0, 0, 0.2);
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-item {
    width: 330px;

    .code-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__input-code {
        flex: 1;
      }

      &__link-code {
        margin-left: 10px;
      }
    }

    &__button-login {
      width: 100%;
    }
  }
}
</style>
