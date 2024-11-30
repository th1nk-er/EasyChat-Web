<template>
  <div class="setting">
    <div class="setting-item">
      <span class="setting-item-label">主题设置</span>
      <el-select
        v-model="theme"
        class="setting-item-select"
        @change="settingStore.updateTheme(theme)"
      >
        <el-option label="浅色" :value="ThemePrefer.LIGHT" />
        <el-option label="深色" :value="ThemePrefer.DARK" />
        <el-option label="跟随系统" :value="ThemePrefer.SYSTEM" />
      </el-select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSettingStore } from '@/stores/setting';
import { ThemePrefer } from './components/types';
const settingStore = useSettingStore();
const theme = ref(settingStore.themePreference);
</script>
<style scoped lang="scss">
@import './components/style.scss';
</style>
