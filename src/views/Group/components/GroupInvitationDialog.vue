<template>
  <el-dialog v-model="dialogVisible" title="邀请列表">
    <el-radio-group v-model="invitationType" @change="loadData">
      <el-radio-button label="邀请" :value="0" />
      <el-radio-button label="管理" :value="1" />
    </el-radio-group>
    <div class="container" v-show="invitationType == 0">
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
        <div class="invitation-list-item__status" v-else>
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
    <div class="container" v-show="invitationType == 1">
      <h2 v-show="adminInvitationList.length === 0" style="text-align: center">
        无数据
      </h2>
      <div
        class="invitation-list-item"
        v-for="(item, index) in adminInvitationList"
        :key="index"
      >
        <img
          :src="getFileUrl(item.groupAvatar)"
          alt=""
          class="invitation-list-item__avatar"
        />
        <div class="invitation-list-item__content">
          <p>
            <span class="primary-color underline">{{
              item.invitedByNickname
            }}</span>
            <span class="primary-color underline"
              >({{ item.invitedByUsername }})</span
            >
            <span>邀请</span>
            <span class="primary-color underline">{{
              item.inviterNickname
            }}</span>
            <span class="primary-color underline"
              >({{ item.inviterUsername }})</span
            >
            <span>加入群组</span>
            <span class="primary-color underline">{{ item.groupName }}</span>
          </p>
        </div>
        <div
          class="invitation-list-item__button-group"
          v-if="item.status == GroupInvitationStatus.ADMIN_PENDING"
        >
          <el-button type="primary">同意</el-button>
          <el-button>拒绝</el-button>
        </div>
        <div class="invitation-list-item__status" v-else>
          <span v-if="item.status == GroupInvitationStatus.ADMIN_ACCEPTED"
            >已同意</span
          >
          <span v-if="item.status == GroupInvitationStatus.ADMIN_REJECTED"
            >已拒绝</span
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
import {
  getAdminGroupInvitationList,
  getGroupInvitationList,
} from '@/api/group';
import {
  GroupInvitationStatus,
  type GroupAdminInvitationVo,
  type GroupInvitationVo,
} from '@/api/group/types';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';

const dialogVisible = defineModel({ type: Boolean, default: false });
const userStore = useUserStore();
const invitationType = ref(0);
watch(dialogVisible, (value) => {
  if (value) {
    invitationType.value = 0;
    invitationList.value = [];
    adminInvitationList.value = [];
    invitationPage.value = 1;
    adminInvitationPage.value = 1;
    hasMoreData.value = true;
    loadData();
  }
});
const invitationPage = ref(1);
const adminInvitationPage = ref(1);
const hasMoreData = ref(true);
const adminHasMoreData = ref(true);
const invitationList = ref<GroupInvitationVo[]>([]);
const adminInvitationList = ref<GroupAdminInvitationVo[]>([]);
const loadData = async () => {
  if (invitationType.value == 0 && hasMoreData.value) {
    const resp = await getGroupInvitationList(
      userStore.userInfo.id,
      invitationPage.value++
    );
    if (resp.data.length > 0) invitationList.value.push(...resp.data);
    else hasMoreData.value = false;
  } else if (invitationType.value == 1 && adminHasMoreData.value) {
    const resp = await getAdminGroupInvitationList(
      userStore.userInfo.id,
      adminInvitationPage.value++
    );
    if (resp.data.length > 0) adminInvitationList.value.push(...resp.data);
    else adminHasMoreData.value = false;
  }
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
