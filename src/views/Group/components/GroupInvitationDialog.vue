<template>
  <el-dialog v-model="dialogVisible" title="邀请列表">
    <div class="container">
      <h2 v-show="invitationList.length === 0" style="text-align: center">
        无数据
      </h2>
      <div
        class="invitation-list-item"
        v-for="(item, index) in invitationList"
        :key="index"
      >
        <img
          :src="getFileUrl(item.groupAvatar)"
          alt=""
          class="invitation-list-item__avatar"
        />
        <div class="invitation-list-item__content">
          <p>
            <span
              class="primary-color underline"
              v-if="
                item.invitedByRemark != undefined &&
                item.invitedByRemark.length > 0
              "
              >{{ item.invitedByRemark }}</span
            >
            <span class="primary-color underline" v-else>{{
              item.invitedByNickname
            }}</span>
            <span class="primary-color underline"
              >({{ item.invitedByUsername }})</span
            >
            <span>邀请您加入群组</span>
            <span class="primary-color underline">{{ item.groupName }}</span>
          </p>
        </div>
        <div
          class="invitation-list-item__button-group"
          v-if="item.status == GroupInvitationStatus.PENDING"
        >
          <el-button type="primary">同意</el-button>
          <el-button>拒绝</el-button>
        </div>
      </div>
      <el-link :underline="false" @click="loadData" v-if="hasMoreData"
        >加载更多</el-link
      >
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { getGroupInvitationList } from '@/api/group';
import {
  GroupInvitationStatus,
  type GroupInvitationVo,
} from '@/api/group/types';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';

const dialogVisible = defineModel({ type: Boolean, default: false });
const userStore = useUserStore();
watch(dialogVisible, (value) => {
  if (value) {
    invitationList.value = [];
    currentPage.value = 1;
    hasMoreData.value = true;
    loadData();
  }
});
const currentPage = ref(1);
const hasMoreData = ref(true);
const invitationList = ref([] as GroupInvitationVo[]);
const loadData = async () => {
  if (!hasMoreData.value) return;
  const resp = await getGroupInvitationList(
    userStore.userInfo.id,
    currentPage.value++
  );
  if (resp.data.length > 0) invitationList.value.push(...resp.data);
  else hasMoreData.value = false;
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  .invitation-list-item {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    &__avatar {
      border-radius: 50%;
      width: 60px;
      height: 60px;
    }
    &__content {
      flex-grow: 1;
      margin-left: 10px;
      .underline {
        cursor: pointer;
        font-weight: bold;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.primary-color {
  color: var(--el-color-primary);
}
</style>
