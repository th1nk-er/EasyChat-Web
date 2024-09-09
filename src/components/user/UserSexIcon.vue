<template>
  <IconMale v-if="sex == UserSex.MALE" :style="style" class="sex-male" />
  <IconFemale v-if="sex == UserSex.FEMALE" :style="style" class="sex-female" />
  <IconAgender v-if="sex == UserSex.SECRET" :style="style" class="sex-secret" />
</template>
<script setup lang="ts">
import { UserSex } from '@/api/user/types';

const props = defineProps({
  sex: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 24,
    required: false,
  },
});
const style = ref('');

onMounted(() => {
  style.value = `width: ${props.size}px; height: ${props.size}px;`;
});
</script>
<style scoped lang="scss">
.sex-male {
  fill: rgb(64, 158, 255);
}
.sex-female {
  fill: rgb(255, 64, 129);
}
.sex-secret {
  fill: rgb(255, 193, 7);
}
</style>
