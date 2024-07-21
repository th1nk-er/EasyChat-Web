<template>
  <div class="chat-list-box">
    <AppTitle />
    <LoginFrom />
    <EmailForm />
  </div>
</template>
<script setup lang="ts">
import AppTitle from "@/components/common/AppTitle.vue";
import { EmailForm, LoginFrom } from "./components";
</script>
<style lang="scss" scoped>
.chat-list-box {
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
