<template>
  <div class="container">
    <FriendList />
  </div>
</template>
<script setup lang="ts">
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
