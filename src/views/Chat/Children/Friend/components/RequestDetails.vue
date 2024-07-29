<template>
  <div class="request-details" v-show="visible">
    <div class="request-details-content">
      <img
        :src="getAvatarUrl(item.avatar)"
        class="request-details-content__img-avatar"
      />
      <div class="content-info">
        <span class="content-info-nickname">{{ item.nickname }}</span>
        <span class="content-info-username">({{ item.username }})</span>
        <div class="content-info-addInfo">
          <span>附加消息：</span>
          <span>{{ item.addInfo }}</span>
          <p>时间：{{ getTimeString(item.createTime) }}</p>
        </div>
      </div>
      <div class="content-operation">
        <div
          class="content-operation-button-group"
          v-show="item.addType == AddType.ADD_BY_OTHER"
        >
          <el-button
            class="agree"
            type="primary"
            @click="
              handleAddRequest({
                id: item.id,
                status: AddStatus.AGREED,
              })
            "
            >同意</el-button
          >
          <el-button class="refuse" type="danger">拒绝</el-button>
          <el-button
            class="ignore"
            @click="
              handleAddRequest({
                id: item.id,
                status: AddStatus.IGNORED,
              })
            "
            >忽略</el-button
          >
        </div>
        <el-button
          class="button-back"
          @click="
            visible = false;
            emit('onClose');
          "
          >返回</el-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getAvatarUrl } from "@/utils/userUtils";
import { getTimeString } from "@/utils/timeUtils";
import { handleAddRequest } from "@/api/friend";
import { AddStatus, AddType, type RequestRecord } from "@/api/friend/type";
const visible = defineModel("visible", { type: Boolean, default: false });
defineProps({
  item: {
    type: Object as PropType<RequestRecord>,
    default: {},
  },
});
const emit = defineEmits(["onClose"]);
</script>
<style scoped lang="scss">
.request-details {
  &-content {
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &__img-avatar {
      width: 100px;
      height: 100px;
    }
    .content-info {
      text-align: center;
      width: 90%;
      gap: 10px;
      &-addInfo {
        margin: 5px 0;
        text-align: left;
        width: 100%;
        height: 120px;
        padding: 5px;
        color: var(--color-subtitle);
        border: 2px solid var(--color-background-mute);
        background-color: var(--color-background-soft);
      }
    }
    .content-operation {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 90%;
      gap: 5px;
      &-button-group {
        display: flex;
      }
      .button-back {
        width: 100%;
      }
    }
  }
}
</style>
