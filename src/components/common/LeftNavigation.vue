<template>
  <div class="container">
    <el-badge
      :value="chatStore.unread"
      :max="99"
      :show-zero="false"
      class="item"
      :offset="[-10, 10]"
    >
      <IconChat
        class="icon"
        :class="router.currentRoute.value.name == 'Chat' ? 'icon-selected' : ''"
        @click="router.push({ name: 'Chat' })"
      />
    </el-badge>
    <IconPerson
      class="icon"
      :class="router.currentRoute.value.name == 'Friend' ? 'icon-selected' : ''"
      @click="router.push({ name: 'Friend' })"
    />
    <IconGroup
      class="icon"
      :class="router.currentRoute.value.name == 'Group' ? 'icon-selected' : ''"
      @click="router.push({ name: 'Group' })"
    />
    <div class="divider" />
    <el-avatar
      :src="getFileUrl(userStore.userInfo.avatar)"
      class="avatar"
      @click="userInfoShow = true"
    />
    <IconSettings
      class="icon"
      :class="
        router.currentRoute.value.name == 'Setting' ? 'icon-selected' : ''
      "
      @click="router.push({ name: 'Setting' })"
    />
    <UserInfoDialog v-model="userInfoShow" />
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import UserInfoDialog from '@/components/user/UserInfoDialog.vue';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';

const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();
const userInfoShow = ref(false);
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 0;
  width: 55px;
  background-color: #242839;
  height: 100%;
  display: flex;
  flex-direction: column;

  .divider {
    flex-grow: 1;
  }
  .icon {
    fill: #757e88;
    width: 50px;
    height: 50px;
    padding: 10px 0;
    margin-bottom: 8px;
    transition: all 0.2s;
  }
  .icon:hover {
    fill: #eeffff;
  }
  .icon-selected {
    border-left: 1px solid #eeffff;
    fill: #eeffff;
  }
  .avatar {
    width: 32px;
    height: 32px;
    margin: 8px auto;
    cursor: pointer;
  }
}
</style>
