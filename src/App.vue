<script setup lang="ts">
import { useSettingStore } from "@/stores/setting";
const settingStore = useSettingStore();
onMounted(() => {
  settingStore.updateTheme();
});
</script>

<template>
  <Router-View></Router-View>
</template>

<style scoped></style>
