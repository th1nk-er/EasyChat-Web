<template>
  <div class="main">
    <LeftNavigation />
    <div class="center">
      <ChatList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatList, LeftNavigation } from "./components";
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  min-height: 600px;
  display: flex;
}
.center {
  height: 100vh;
  width:400px;
}
</style>
