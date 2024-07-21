<template>
  <div class="tool-bar">
    <div class="tool-bar-item search-bar">
      <IconSearch />
    </div>
    <div class="tool-bar-item" @click="addDialogVisible = true">
      <IconAdd />
    </div>
    <el-dialog v-model="addDialogVisible" title="添加好友" top="5px">
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
        <div class="search-result">
          <div class="search-result__list">
            <div
              v-for="(user, key) in searchResult.records"
              :key="key"
              class="user-item"
            >
              <img class="user-item__img-avatar" />
              <div class="user-item__content">
                <div class="user-item__content__text">
                  <p class="user-item__content__text-nickname">
                    {{ user.nickname }}
                    <UserSexIcon :sex="user.sex" :size="20" />
                  </p>
                  <p class="user-item__content__text-username">
                    {{ user.username }}
                  </p>
                </div>
                <el-button
                  class="user-item__content__button-add"
                  @click="handleAddFriend(user.id)"
                  >添加</el-button
                >
              </div>
            </div>
          </div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="searchResult.total"
            :page-size="searchResult.pageSize"
            v-model:current-page="searchCurrentPage"
            :hide-on-single-page="true"
            @update:current-page="handlePagechange()"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { searchUser } from "@/api/user";
import { type SearchResult } from "@/api/user/types";

const addDialogVisible = ref(false);
const searchContent = ref("");
const searchCurrentPage = ref(1);
const searchResult = ref({
  total: 0,
  pageSize: 10,
  records: [],
} as SearchResult);
const handleSearch = async () => {
  const response = await searchUser(
    searchContent.value,
    searchCurrentPage.value
  );
  searchResult.value = response.data;
};
const handlePagechange = () => {
  handleSearch();
};

const handleAddFriend = (id: number) => {
  //TODO 发送好友申请
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
  }
}

.add-dialog {
  display: flex;
  flex-direction: column;

  &__search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .search-result {
    &__list {
      margin: 10px 0;
      width: 100%;
      min-height: 100px;

      .user-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--color-border-mute);
        cursor: pointer;

        &:hover {
          background-color: var(--color-background-soft);
        }

        &__img-avatar {
          padding: 10px 7px;
          margin-right: 5px;
          width: 48px;
          height: 48px;
          border-radius: 8px;
        }

        &__content {
          padding: 5px 15px;
          height: 100%;
          flex-grow: 1;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--color-border);

          &__text {
            flex-grow: 1;
            display: flex;
            width: 65%;
            flex-direction: column;
            justify-content: space-between;

            &-nickname {
              color: var(--color-heading);
              font-weight: bolder;
              overflow: hidden;
              text-wrap: nowrap;
              text-overflow: ellipsis;
              max-width: 200px;
            }

            &-username {
              width: 100%;
              color: var(--color-subtitle);
              overflow: hidden;
              text-wrap: nowrap;
              text-overflow: ellipsis;
              max-width: 260px;
            }
          }
          &__button-add {
          }
        }
      }
    }
  }
}
</style>
