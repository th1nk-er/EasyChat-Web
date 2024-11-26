<template></template>
<script setup lang="ts">
import { userLogout } from '@/api/user';
import { useUserStore } from '@/stores/user';
const router = useRouter();
const userStore = useUserStore();
onMounted(async () => {
  try {
    await userLogout();
    userStore.removeToken();
    router.push({ name: 'Login' });
  } catch (_) {
    router.back();
  }
});
</script>
<style scoped lang="scss"></style>
