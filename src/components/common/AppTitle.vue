<template>
  <div class="app-title">
    <span>{{ title }}</span>
  </div>
</template>
<script setup lang="ts">
const title = import.meta.env.VITE_APP_TITLE;
</script>
<style lang="scss">
.app-title {
  font-size: 3rem;
  font-weight: bolder;
  margin-bottom: 1rem;
  color: var(--el-color-primary);
  padding: 5px;
}
</style>
