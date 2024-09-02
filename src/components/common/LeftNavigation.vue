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
        :class="router.currentRoute.value.name == 'Chat' ? 'icon-selected' : ''"
        @click="router.push({ name: 'Chat' })"
      />
    </el-badge>
    <IconPerson
      :class="router.currentRoute.value.name == 'Friend' ? 'icon-selected' : ''"
      @click="router.push({ name: 'Friend' })"
    />
    <IconGroup
      :class="router.currentRoute.value.name == 'Group' ? 'icon-selected' : ''"
      @click="router.push({ name: 'Group' })"
    />
    <div class="divider" />
    <IconAccountCircle @click="userInfoShow = true" />
    <IconSettings
      :class="
        router.currentRoute.value.name == 'Setting' ? 'icon-selected' : ''
      "
      @click="router.push({ name: 'Setting' })"
    />
    <UserInfoDialog v-model="userInfoShow" />
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import UserInfoDialog from "@/components/user/UserInfoDialog.vue";

const router = useRouter();
const chatStore = useChatStore();
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
  svg {
    fill: #757e88;
    width: 50px;
    height: 50px;
    padding: 10px 0;
    margin-bottom: 8px;
  }
  svg:hover {
    fill: #eeffff;
  }
  .icon-selected {
    border-left: 1px solid #eeffff;
    fill: #eeffff;
  }
}
</style>
