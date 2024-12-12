<template>
  <div class="tool-bar">
    <div
      class="tool-bar-item search-bar"
      @click="
        searchInputVisible = true;
        searchInput?.focus();
      "
    >
      <IconSearch v-show="!searchInputVisible" />
      <el-input
        v-model="searchContent"
        placeholder="输入搜索内容"
        v-show="searchInputVisible"
        ref="searchInput"
        @blur="handlSearchInputBlur"
        @input="emits('onSearch', searchContent)"
        clearable
      />
    </div>
    <el-dropdown class="tool-bar-item" trigger="click">
      <IconAdd />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="addDialogVisible = true"
            ><IconPersonAdd /><span>添加好友</span></el-dropdown-item
          >
          <el-dropdown-item @click="createGroupVisible = true"
            ><IconGroupAdd /><span>创建群组</span></el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <AddFriendDialog v-model="addDialogVisible" />
    <CreateGroupDialog v-model="createGroupVisible" />
  </div>
</template>
<script setup lang="ts">
import type { InputInstance } from 'element-plus';
import AddFriendDialog from '../friend/AddFriendDialog.vue';
import CreateGroupDialog from './CreateGroupDialog.vue';
const emits = defineEmits<{
  onSearch: [string];
}>();
const addDialogVisible = ref(false);
const createGroupVisible = ref(false);
const searchInputVisible = ref(false);
const searchContent = ref('');
const searchInput = ref<InputInstance>();
const handlSearchInputBlur = () => {
  if (searchContent.value == '') searchInputVisible.value = false;
};
</script>

<style lang="scss" scoped>
.tool-bar {
  width: 100%;
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
    transition: 0.5s;
    cursor: text;
    &:hover {
      background-color: var(--color-background);
    }
  }
}
</style>
