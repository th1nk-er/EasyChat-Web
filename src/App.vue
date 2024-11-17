<script setup lang="ts">
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
onMounted(() => {
  settingStore.updateTheme();
});
</script>

<template>
  <Router-View v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </Router-View>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
