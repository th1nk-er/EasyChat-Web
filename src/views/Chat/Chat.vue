<template>
  <div class="main">
    <LeftNavigation />
    <div class="center-box">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftNavigation } from "./components";
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  min-height: 600px;
  display: flex;
}
.center-box {
  flex-grow: 1;
  height: 100vh;
}
</style>
