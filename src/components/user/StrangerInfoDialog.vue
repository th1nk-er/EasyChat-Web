<template>
  <el-dialog v-model="dialogVisible" width="250px">
    <div class="stranger-info">
      <img
        :src="getFileUrl(strangerInfo.avatar)"
        class="stranger-info__avatar"
      />
      <p class="stranger-info__nickname">
        <span>昵称：</span>
        <span class="stranger-info__nickname-value">{{
          strangerInfo.nickname
        }}</span>
      </p>
      <p class="stranger-info__username">
        <span>用户名：</span>
        <span class="stranger-info__username-value">{{
          strangerInfo.username
        }}</span>
      </p>
      <UserSexIcon :sex="strangerInfo.sex" />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getStrangerInfo } from '@/api/user';
import { UserSex, type StrangerVo } from '@/api/user/types';
import { getFileUrl } from '@/utils/file';

const dialogVisible = defineModel({ type: Boolean, default: false });
const props = defineProps({
  strangerId: {
    type: Number,
    required: true,
  },
});
const strangerInfo = ref({ sex: UserSex.SECRET } as StrangerVo);
watch(dialogVisible, async (value) => {
  if (value) {
    strangerInfo.value = (await getStrangerInfo(props.strangerId)).data;
  }
});
</script>
<style lang="scss" scoped>
.stranger-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  &__nickname {
    &-value {
      font-weight: bolder;
    }
  }
  &__username {
    &-value {
      font-weight: bolder;
    }
  }
}
</style>
