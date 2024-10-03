<template>
  <el-dialog v-model="dialogVisible" width="25%">
    <div class="group-info">
      <img :src="getFileUrl(groupInfo.avatar)" class="group-info__avatar" />
      <div class="group-info__details">
        <p>
          <span>群聊名称：</span>
          <span class="group-info__name">
            {{ groupInfo.groupName }}
          </span>
        </p>
        <p>
          <span>群聊简介：</span>
          <span class="group-info__desc">
            {{ groupInfo.groupDesc }}
          </span>
        </p>
        <p>
          <span>创建时间：</span>
          <span class="group-info__create-time">
            {{ getTimeString(groupInfo.createTime) }}
          </span>
        </p>
        <p>
          <span>群聊人数：</span>
          <span class="group-info__member-count">
            {{ groupInfo.memberCount }}
          </span>
        </p>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { getGroupInfo } from '@/api/group';
import type { GroupVo } from '@/api/group/types';
import { getFileUrl } from '@/utils/file';
import { getTimeString } from '@/utils/timeUtils';

const dialogVisible = defineModel({ type: Boolean, default: false });
const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
});
const groupInfo = ref({} as GroupVo);
watch(dialogVisible, async (value) => {
  if (value) {
    groupInfo.value = (await getGroupInfo(props.groupId)).data;
  }
});
</script>
<style lang="scss" scoped>
.group-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    width: 250px;
  }
  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 10px;
  }
  &__name,
  &__desc,
  &__create-time,
  &__member-count {
    font-weight: bolder;
  }
}
</style>
