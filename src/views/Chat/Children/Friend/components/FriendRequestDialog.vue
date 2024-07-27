<template>
  <el-dialog
    v-model="visible"
    title="新朋友"
    width="40%"
    @open="refreshRequestList()"
    class="dialog dark"
  >
    <el-divider />
    <div
      class="request-list"
      v-show="showList"
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
          <div
            class="content-info"
            @click="
              showList = !showList;
              selectedItem = item;
            "
          >
            <span class="content-info-nickname">{{ item.nickname }}</span>
            <span class="content-info-username">({{ item.username }})</span>
            <p class="content-info-addInfo">{{ item.addInfo }}</p>
          </div>
          <div class="content-operation">
            <IconNorthEast
              v-show="item.addType == AddType.ADD_OTHER"
              style="fill: var(--color-subtitle)"
            />
            <el-button
              size="small"
              v-show="item.addType == AddType.ADD_BY_OTHER"
              >同意</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="request-details" v-show="!showList">
      <div class="request-details-content">
        <img
          :src="getAvatarUrl(selectedItem.avatar)"
          class="request-details-content__img-avatar"
        />
        <div class="content-info">
          <span class="content-info-nickname">{{ selectedItem.nickname }}</span>
          <span class="content-info-username"
            >({{ selectedItem.username }})</span
          >
          <div class="content-info-addInfo">
            <span>附加消息：</span>
            <span>{{ selectedItem.addInfo }}</span>
            <p>时间：{{ getTimeString(selectedItem.createTime) }}</p>
          </div>
        </div>
        <div class="content-operation">
          <div
            class="content-operation-button-group"
            v-show="selectedItem.addType == AddType.ADD_BY_OTHER"
          >
            <el-button class="agree" type="primary">同意</el-button>
            <el-button class="refuse" type="danger">拒绝</el-button>
            <el-button class="ignore">忽略</el-button>
          </div>
          <el-button class="button-back" @click="refreshRequestList()"
            >返回</el-button
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { getAddRequestList } from "@/api/friend";
import { AddStatus, AddType, type FriendRequestData } from "@/api/friend/type";
import { UserSex } from "@/api/user/types";
import { getTimeString } from "@/utils/timeUtils";
import { getAvatarUrl } from "@/utils/userUtils";

const visible = defineModel("visible", { type: Boolean, default: false });
const showList = ref(true);

const currentPage = ref(0);
const loadedData = ref<FriendRequestData>({
  total: 0,
  pageSize: 0,
  records: [],
});
const scrollDisabled = ref(false);
const refreshRequestList = () => {
  showList.value = true;
  currentPage.value = 0;
  loadedData.value.records = [];
  scrollDisabled.value = false;
};
const loadRequestList = async () => {
  currentPage.value++;
  const resp = await getAddRequestList(currentPage.value);
  if (resp.data.records.length < resp.data.pageSize)
    scrollDisabled.value = true;
  loadedData.value.records.push(...resp.data.records);
};

const selectedItem = ref<FriendRequestData["records"][0]>({
  id: 0,
  nickname: "",
  username: "",
  sex: UserSex.SECRET,
  avatar: "/avatar/default.jpg",
  addInfo: "",
  createTime: "",
  status: AddStatus.PENDING,
  addType: AddType.ADD_OTHER,
  strangerId: 0,
  uid: 0,
});
</script>

<style scoped lang="scss">
.dialog {
  background-color: var(--color-background);
  color:var(--color-text) * {
    background-color: var(--color-background);
  }
}
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
      }
    }
  }
  &-item:hover {
    background-color: var(--color-background-mute);
  }
}
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
