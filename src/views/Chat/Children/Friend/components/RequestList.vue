<template>
  <div
    class="request-list"
    v-show="visible"
    v-infinite-scroll="loadRequestList"
    :infinite-scroll-disabled="scrollDisabled"
  >
    <div
      class="request-list-item"
      v-for="(item, key) in loadedData.records"
      :key="key"
    >
      <img
        :src="getAvatarUrl(item.avatar)"
        class="request-list-item__img-avatar"
      />
      <div class="request-list-item__content">
        <div class="content-info" @click="emit('onSelected', item)">
          <span class="content-info-nickname">{{ item.nickname }}</span>
          <span class="content-info-username">({{ item.username }})</span>
          <p class="content-info-addInfo">{{ item.addInfo }}</p>
        </div>
        <div class="content-operation">
          <IconNorthEast
            v-show="item.addType == AddType.ADD_OTHER"
            style="fill: var(--color-subtitle)"
          />
          <p
            v-show="
              item.addType == AddType.ADD_OTHER &&
              item.status == AddStatus.PENDING
            "
          >
            等待验证
          </p>
          <p v-show="item.status == AddStatus.AGREED">已同意</p>
          <p v-show="item.status == AddStatus.REFUSED">已拒绝</p>
          <p v-show="item.status == AddStatus.IGNORED">已忽略</p>
          <el-button
            size="small"
            v-show="
              item.addType == AddType.ADD_BY_OTHER &&
              item.status == AddStatus.PENDING
            "
            @click="handleAgreeRequest(key)"
            >同意</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getAddRequestList } from "@/api/friend";
import {
  AddStatus,
  AddType,
  type FriendRequestData,
  type RequestRecord,
} from "@/api/friend/type";
import { getAvatarUrl } from "@/utils/userUtils";
import { agreeRequest } from "./request";
const emit = defineEmits<{
  (event: "onSelected", value: RequestRecord): void;
}>();
const visible = defineModel("visible", { type: Boolean, default: false });
const currentPage = ref(0);
const scrollDisabled = ref(false);
const loadedData = ref<FriendRequestData>({
  total: 0,
  pageSize: 0,
  records: [],
});
const loadRequestList = async () => {
  currentPage.value++;
  const resp = await getAddRequestList(currentPage.value);
  if (resp.data.records.length < resp.data.pageSize)
    scrollDisabled.value = true;
  loadedData.value.records.push(...resp.data.records);
};
watch(visible, (value) => {
  if (value) {
    currentPage.value = 0;
    scrollDisabled.value = false;
    loadedData.value.records = [];
    loadRequestList();
  }
});
const handleAgreeRequest = async (key: number) => {
  await agreeRequest(loadedData.value.records[key].id);
  loadedData.value.records[key].status = AddStatus.AGREED;
  ElMessage.success("您已同意该好友申请");
};
</script>
<style scoped lang="scss">
.request-list {
  overflow: auto;
  min-height: 400px;
  width: 100%;
  &-item {
    width: 100%;
    display: flex;
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

    &__content {
      display: flex;
      width: 90%;
      .content-info {
        width: 200px;
        flex-grow: 1;
        &-nickname {
          flex-grow: 1;
          font-weight: bolder;
          margin-left: 5px;
          margin-right: 8px;
        }
        &-addInfo {
          text-wrap: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .content-operation {
        display: flex;
        gap: 3px;
        padding: 0 5px;
      }
    }
  }
  &-item:hover {
    background-color: var(--color-background-mute);
  }
}
</style>
