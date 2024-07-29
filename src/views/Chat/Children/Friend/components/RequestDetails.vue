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
          v-show="
            item.addType == AddType.ADD_BY_OTHER &&
            item.status == AddStatus.PENDING
          "
        >
          <el-button class="agree" type="primary" @click="handleAgreeRequest()"
            >同意</el-button
          >
          <el-button
            class="refuse"
            type="danger"
            @click="refuseReasonShow = true"
            >拒绝</el-button
          >
          <el-button class="ignore" @click="handleIgnoreRequest()"
            >忽略</el-button
          >
        </div>
        <template v-if="item.addType == AddType.ADD_BY_OTHER">
          <p v-show="item.status == AddStatus.AGREED">您已接受该请求</p>
          <p v-show="item.status == AddStatus.REFUSED">您已拒绝该请求</p>
          <p v-show="item.status == AddStatus.IGNORED">您已忽略该请求</p>
        </template>
        <template v-else>
          <p v-show="item.status == AddStatus.PENDING">等待对方验证中</p>
          <p v-show="item.status == AddStatus.AGREED">对方已接受您的请求</p>
          <p v-show="item.status == AddStatus.REFUSED">对方已拒绝您的请求</p>
        </template>
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
    <el-dialog v-model="refuseReasonShow" title="拒绝原因" width="30%">
      <el-input
        type="textarea"
        v-model="refuseReason"
        placeholder="请输入附加消息"
        maxlength="50"
        aria-required="true"
        class="input-refuse-reason"
      />
      <el-button type="primary" @click="handleRefuseRequest()"
        >拒绝申请</el-button
      >
      <el-button @click="refuseReasonShow = false">取消</el-button>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { getAvatarUrl } from "@/utils/userUtils";
import { getTimeString } from "@/utils/timeUtils";
import { replyAddRequest } from "@/api/friend";
import { AddStatus, AddType, type RequestRecord } from "@/api/friend/type";
import { agreeRequest, refuseRequest, ignoreRequest } from "./request";
const visible = defineModel("visible", { type: Boolean, default: false });
const props = defineProps({
  item: {
    type: Object as PropType<RequestRecord>,
    default: {},
  },
});
watch(visible, (value) => {
  if (value) {
    item.value = props.item;
  }
});
const item = ref({} as RequestRecord);
const emit = defineEmits(["onClose"]);

const refuseReasonShow = ref(false);
const refuseReason = ref("");
const handleAgreeRequest = async () => {
  await agreeRequest(item.value.id);
  props.item.status = AddStatus.AGREED;
  ElMessage.success("您已同意该好友申请");
};
const handleRefuseRequest = async () => {
  await refuseRequest(item.value.id);
  props.item.status = AddStatus.REFUSED;
  ElMessage.success("您已拒绝该好友申请");
};
const handleIgnoreRequest = async () => {
  await ignoreRequest(item.value.id, refuseReason.value);
  props.item.status = AddStatus.IGNORED;
  ElMessage.success("您已忽略该好友申请");
};
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
.input-refuse-reason {
  margin-bottom: 10px;
}
</style>
