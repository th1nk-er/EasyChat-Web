<template>
  <div class="container">
    <el-badge
      :value="chatStore.unread"
      :max="99"
      :show-zero="false"
      class="item"
      :offset="[-10, 10]"
    >
      <IconChat class="icon-selected" />
    </el-badge>
    <IconPerson />
    <IconGroup />
    <div class="divider" />
    <IconAccountCircle />
    <IconSettings />
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 0;
  width: 55px;
  background-color: #242839;
  height: 100%;
  display: flex;
  flex-direction: column;

  .divider {
    flex-grow: 1;
  }
  svg {
    fill: #757e88;
    width: 50px;
    height: 50px;
    padding: 10px 0;
    margin-bottom: 8px;
  }
  svg:hover {
    fill: #eeffff;
  }
  .icon-selected {
    border-left: 1px solid #eeffff;
    fill: #eeffff;
  }
}
</style>
