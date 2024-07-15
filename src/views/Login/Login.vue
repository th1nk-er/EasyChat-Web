<template>
  <div class="box">
    <div class="main">
      <LoginFrom />
      <EmailForm />
    </div>
  </div>
</template>
<script setup lang="ts">
import { EmailForm, LoginFrom } from "./components";
</script>
<style lang="scss" scoped>
.box {
  height: 100vh;
  width: 100%;
  background-image: url("https://cdn.pixabay.com/photo/2024/06/21/15/18/road-8844555_1280.jpg");
  background-size: cover;
}

.main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>
