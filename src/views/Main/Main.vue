<template>
  <div class="router-main">
    <LeftNavigation />
    <div class="router-container" v-loading="appStore.loading">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LeftNavigation } from './components';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
</script>
<style lang="scss" scoped>
.router-main {
  height: 100vh;
  min-height: 600px;
  display: flex;
  .router-container {
    flex-grow: 1;
    height: 100%;
    display: flex;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
