<template></template>
<script setup lang="ts">
import { LoginType, useLoginState } from "@/views/Login/components/userLogin";

const loginState = useLoginState();
const getShow = computed(
  () => unref(loginState.getLoginType) === LoginType.PASSWORD
);
</script>
<style scoped lang="scss"></style>
