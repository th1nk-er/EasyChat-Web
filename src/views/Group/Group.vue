<template>
  <div class="container">
    <LeftNavigation />
    <div class="center-box">
      <TopSearchBar />
      <GroupList />
    </div>
  </div>
</template>
<script setup lang="ts">
import LeftNavigation from '@/components/common/LeftNavigation.vue';
import TopSearchBar from '@/components/common/TopSearchBar.vue';
import { GroupList } from './components';
</script>
<style lang="scss" scoped>
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
