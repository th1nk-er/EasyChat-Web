<template>
  <div class="container">
    <ToolBar />
    <div class="main">
      <FriendRequestDialog v-model="requestDialogShow" />
      <div class="friend-item" @click="requestDialogShow = true">
        <IconPersonFill
          class="friend-item__img-avatar svg"
          style="background-color: orange; fill: white"
        />
        <p class="friend-item__title">新朋友</p>
      </div>
      <div class="friend-list">
        <div class="friend-item">
          <img
            src="https://avatars.githubusercontent.com/u/69061641?v=4"
            class="friend-item__img-avatar"
          />
          <div class="friend-item__content">
            <p class="friend-item__title">th1nk</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ToolBar } from "../../components";
import { FriendRequestDialog } from "./components";

const requestDialogShow = ref(false);
</script>

<style scoped lang="scss">
.container {
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .main {
    flex-grow: 1;
    width: 100%;
    background-color: var(--color-background-mute);

    .friend-item {
      display: flex;
      width: 100%;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      cursor: pointer;

      &__img-avatar {
        border-radius: 8px;
        margin: 10px 7px;
        width: 40px;
        height: 40px;
        &.svg {
          padding: 8px;
        }
      }

      &__title {
        flex-grow: 1;
        font-weight: bolder;
        margin-left: 10px;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .friend-item:hover {
      background-color: var(--color-background-soft);
    }
  }
}
</style>
