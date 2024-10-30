<template>
  <el-form ref="formRef" :model="formData" class="register-form" :rules="rules">
    <el-form-item prop="username" class="register-form-item">
      <el-input
        v-model="formData.username"
        placeholder="请输入用户名"
        maxlength="20"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password" class="register-form-item">
      <el-input
        v-model="formData.password"
        placeholder="请输入密码"
        type="password"
        show-password
        maxlength="20"
      ></el-input>
    </el-form-item>
    <el-form-item prop="repeatPassword" class="register-form-item">
      <el-input
        v-model="formData.repeatPassword"
        placeholder="请再次输入密码"
        type="password"
        show-password
        maxlength="20"
      ></el-input>
    </el-form-item>
    <el-form-item prop="email" class="register-form-item">
      <el-input
        v-model="formData.email"
        placeholder="请输入邮箱"
        maxlength="30"
      ></el-input>
    </el-form-item>
    <el-form-item prop="verifyCode" class="register-form-item">
      <div class="verifycode-container">
        <el-input
          v-model="formData.verifyCode"
          placeholder="验证码"
          maxlength="6"
          class="verifycode-container__input-verifycode"
        >
        </el-input>
        <el-link
          class="verifycode-container__link-getverifycode"
          type="primary"
          @click="getVerifyCode"
          :disabled="sendDisabled"
          >获取验证码<span v-show="sendSeconds > 0"
            >({{ sendSeconds }})</span
          ></el-link
        >
      </div>
    </el-form-item>
    <el-form-item class="register-form-item">
      <el-button
        type="primary"
        class="register-form-item__button-register"
        @click="handleRegister(formRef)"
        >注册</el-button
      >
    </el-form-item>
    <el-link type="primary" @click="toLogin">返回登录</el-link>
  </el-form>
</template>

<script setup lang="ts">
import { register, sendVerifyCode } from '@/api/register';
import type { RegisterVo } from '@/api/register/types';
import type { FormInstance, FormRules } from 'element-plus';
import { isValidEmail } from '@/utils/validate';

const router = useRouter();

const formRef = ref<FormInstance>();
const rules = reactive<FormRules<typeof formData>>({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9_-]{3,20}$/,
      message: '只能包含字母、数字、下划线、减号, 长度在3-20个字符之间',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: '密码长度在6-20个字符之间',
    },
  ],
  repeatPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
    },
  ],
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
const formData = reactive({
  username: '',
  password: '',
  repeatPassword: '',
  email: '',
  verifyCode: '',
});

const toLogin = () => {
  router.push({ name: 'Login' });
};

const sendDisabled = ref(false);
const sendSeconds = ref(0);
const getVerifyCode = async () => {
  sendDisabled.value = true;
  if (isValidEmail(formData.email)) {
    await sendVerifyCode(formData.email);
    ElMessage.success('验证码已发送');
    sendSeconds.value = 60;
  } else {
    ElMessage.error('请输入正确的邮箱');
    sendDisabled.value = false;
  }
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

const handleRegister = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const registerVo: RegisterVo = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        verifyCode: formData.verifyCode,
      };
      await register(registerVo);
      ElMessage.success('注册成功,即将跳转登录页面');
      // 2秒后跳转登录页面
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 2000);
    }
  });
};
</script>

<style scoped lang="scss">
.register-form {
  padding: 30px 50px;
  border-radius: 10px;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.8;

  &-item {
    width: 330px;

    .verifycode-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__input-verifycode {
        flex: 1;
      }

      &__link-getverifycode {
        margin-left: 10px;
      }
    }

    &__button-register {
      height: 35px;
      width: 100%;
    }
  }
}
</style>
