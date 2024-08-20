<template>
  <div class="main">
    <LeftNavigation />
    <div class="center-box">
      <el-tabs tab-position="left" v-model="tabIndex" class="tab-box">
        <el-tab-pane label="通用设置" name="common" class="tab-item">
          <CommonSetting />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import LeftNavigation from "@/components/common/LeftNavigation.vue";
import { CommonSetting } from "./components";
const tabIndex = ref("common");
</script>
<style scoped lang="scss">
.main {
  height: 100vh;
  min-height: 600px;
  display: flex;
}
.center-box {
  flex-grow: 1;
  height: 100%;
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
