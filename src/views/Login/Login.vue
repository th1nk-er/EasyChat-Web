<template>
  <div class="login-box">
    <AppTitle />
    <LoginFrom />
    <EmailForm />
  </div>
</template>
<script setup lang="ts">
import AppTitle from "@/components/common/AppTitle.vue";
import { EmailForm, LoginFrom } from "./components";
import { useUserStore } from "@/stores/user";
const router = useRouter();
const userStore = useUserStore();
onMounted(() => {
  const url = router.currentRoute.value.query.redirect;
  let redirectUrl;
  if (url) {
    redirectUrl = url.toString();
  }
  if (userStore.getUserToken) {
    if (redirectUrl) window.location.href = redirectUrl;
    else router.push({ name: "Chat" });
  }
});
</script>
<style lang="scss" scoped>
.login-box {
  height: 100vh;
  width: 100%;
  background-image: url("https://cdn.pixabay.com/photo/2024/06/21/15/18/road-8844555_1280.jpg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
