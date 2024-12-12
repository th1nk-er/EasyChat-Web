<template>
  <div class="container">
    <GroupList />
  </div>
</template>
<script setup lang="ts">
import { GroupList } from './components';
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
