<template>
  <el-dialog v-model="dialogShow"> </el-dialog>
</template>
<script setup lang="ts">
const dialogShow = defineModel("dialogShow", {
  type: Boolean,
  default: false,
});
</script>
<style scoped lang="scss"></style>
