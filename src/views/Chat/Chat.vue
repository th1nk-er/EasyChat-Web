<template>
  <div class="chat-list-box">
    <LeftNavigation />
    <div class="center">
      <ToolBar class="tool-bar" />
      <ChatList class="chat-list" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatList, LeftNavigation, ToolBar } from "./components";
</script>

<style scoped lang="scss">
.chat-list-box {
  height: 100vh;
  min-height: 600px;
  display: flex;
}
.center {
  height: 100vh;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
  .chat-list {
    flex-grow: 1;
  }
}
</style>
