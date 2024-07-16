<template>
  <div class="main">
    <AppTitle />
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import AppTitle from "@/components/common/AppTitle.vue";
import { RegisterForm } from "./components";
</script>
<style scoped lang="scss">
.main {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("https://cdn.pixabay.com/photo/2015/06/02/00/54/pink-794507_1280.jpg");
  background-size: cover;
}
</style>
