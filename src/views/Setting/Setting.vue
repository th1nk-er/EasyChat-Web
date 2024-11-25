<template>
  <div class="main">
    <LeftNavigation />
    <div class="center-box">
      <el-tabs
        tab-position="left"
        v-model="tabIndex"
        class="tab-box"
        @tab-change="onTabChange"
      >
        <el-tab-pane
          label="通用设置"
          :name="SettingType.COMMON"
          class="tab-item"
        >
          <CommonSetting :key="componentsKey[SettingType.COMMON]" />
        </el-tab-pane>
        <el-tab-pane
          label="群聊设置"
          :name="SettingType.GROUP"
          class="tab-item"
        >
          <GroupSetting :key="componentsKey[SettingType.GROUP]" />
        </el-tab-pane>
        <el-tab-pane
          label="安全设置"
          :name="SettingType.SECURITY"
          class="tab-item"
        >
          <SecuritySetting :key="componentsKey[SettingType.SECURITY]" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import LeftNavigation from '@/components/common/LeftNavigation.vue';
import { CommonSetting, GroupSetting, SecuritySetting } from './components';
import { SettingType } from './components/types';
import type { TabPaneName } from 'element-plus';
const route = useRoute();
const tabIndex = ref(SettingType.COMMON);
onMounted(() => {
  if (route.params.settingType) {
    tabIndex.value = route.params.settingType as SettingType;
  }
});
const componentsKey = {
  [SettingType.COMMON]: 0,
  [SettingType.GROUP]: 0,
  [SettingType.SECURITY]: 0,
};
const needUpdateComponents = [SettingType.SECURITY];
const onTabChange = (tab: TabPaneName) => {
  if (needUpdateComponents.includes(tab as SettingType)) {
    componentsKey[tab as SettingType] += 1;
  }
};
</script>
<style scoped lang="scss">
.main {
  height: 100vh;
  min-height: 600px;
  display: flex;
}
.center-box {
  flex-grow: 1;
  height: 100vh;
  overflow-y: scroll;
}
.tab-box {
  margin: 3%;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  .tab-item {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
