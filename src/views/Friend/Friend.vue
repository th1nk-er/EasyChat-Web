<template>
  <div class="container">
    <TopSearchBar />
    <FriendList />
  </div>
</template>
<script setup lang="ts">
import TopSearchBar from '@/components/common/TopSearchBar.vue';
import { FriendList } from './components';
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
