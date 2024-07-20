<template>
  <div class="tool-bar">
    <div class="tool-bar-item search-bar">
      <IconSearch />
    </div>
    <div class="tool-bar-item" @click="addDialogVisible = true">
      <IconAdd />
    </div>
  </div>
  <el-dialog v-model="addDialogVisible" title="添加好友">
    <div class="add-dialog">
      <div class="add-dialog__search-bar">
        <el-input
          v-model="searchContent"
          placeholder="请输入用户名/昵称进行搜索"
        >
          <template #prepend>
            <IconSearch />
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { searchUser } from "@/api/user";

const addDialogVisible = ref(false);
const searchContent = ref("");
const handleSearch = async () => {
  const response = await searchUser(searchContent.value);
  //TODO 展示数据
};
</script>

<style lang="scss" scoped>
.tool-bar {
  background-color: var(--color-background-mute);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;

  &-item {
    border-radius: 10px;
    border: 1px solid var(--color-border);
    background-color: var(--color-background-soft);
    margin: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
    svg {
      width: 18px;
      height: 18px;
      fill: var(--color-subtitle);
    }
  }

  &-item.search-bar {
    flex-grow: 1;
  }
}

.add-dialog {
  display: flex;
  flex-direction: column;

  &__search-bar {
    display: flex;
    align-items: center;
  }
}
</style>
