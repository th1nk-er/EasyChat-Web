<template>
  <div class="container">
    <LeftNavigation />
    <div class="center-box">
      <TopSearchBar />
      <FriendList />
    </div>
  </div>
</template>
<script setup lang="ts">
import LeftNavigation from "@/components/common/LeftNavigation.vue";
import TopSearchBar from "@/components/common/TopSearchBar.vue";
import { FriendList } from "./components";
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  .center-box {
    flex-grow: 1;
    max-width: 400px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
