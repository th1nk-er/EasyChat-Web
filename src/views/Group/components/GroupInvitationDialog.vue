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
              @click="showFriendInfo(item.invitedById)"
              v-if="
                item.invitedByRemark != undefined &&
                item.invitedByRemark.length > 0
              "
              >{{ item.invitedByRemark }}</span
            >
            <span class="primary-color underline" v-else>{{
              item.invitedByNickname
            }}</span>
            <span
              class="primary-color underline"
              @click="showFriendInfo(item.invitedById)"
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
        <div
          class="invitation-list-item__status"
          v-if="item.status != GroupInvitationStatus.PENDING"
        >
          <span v-if="item.status == GroupInvitationStatus.REJECTED"
            >已拒绝</span
          >
          <span v-if="item.status == GroupInvitationStatus.ADMIN_ACCEPTED"
            >管理员已同意</span
          >
          <span v-if="item.status == GroupInvitationStatus.ADMIN_REJECTED"
            >管理员已拒绝</span
          >
          <span v-if="item.status == GroupInvitationStatus.ADMIN_PENDING"
            >等待管理员处理</span
          >
          <span v-if="item.status == GroupInvitationStatus.EXPIRED"
            >已过期</span
          >
        </div>
      </div>
      <el-link :underline="false" @click="loadData" v-if="hasMoreData"
        >加载更多</el-link
      >
    </div>
    <FriendInfoDialog :friend-id="friendId" v-model="friendInfoShow" />
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
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';

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
const friendId = ref(0);
const friendInfoShow = ref(false);
const showFriendInfo = (id: number) => {
  friendId.value = id;
  friendInfoShow.value = true;
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
    padding: 5px;
    &:hover {
      background-color: var(--color-background-mute);
    }
    &__avatar {
      border-radius: 50%;
      width: 50px;
      height: 50px;
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
