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
          <p v-if="item.status == GroupInvitationStatus.KICKED">
            <span>管理员</span>
            <span
              class="primary link"
              @click="showStrangerInfo(item.invitedById)"
              >{{ item.invitedByNickname }}</span
            >
            <span
              class="primary link"
              @click="showStrangerInfo(item.invitedById)"
              >({{ item.invitedByUsername }})</span
            >
            <span>将你移出群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
          <p v-else-if="item.status == GroupInvitationStatus.QUITED">
            <span>你退出了群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
          <p v-else>
            <span
              class="primary link"
              @click="showFriendInfo(item.invitedById)"
              v-if="
                item.invitedByRemark != undefined &&
                item.invitedByRemark.length > 0
              "
              >{{ item.invitedByRemark }}</span
            >
            <span class="primary link" v-else>{{
              item.invitedByNickname
            }}</span>
            <span class="primary link" @click="showFriendInfo(item.invitedById)"
              >({{ item.invitedByUsername }})</span
            >
            <span>邀请您加入群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
        </div>
        <div
          class="invitation-list-item__button-group"
          v-if="item.status == GroupInvitationStatus.PENDING"
        >
          <el-button type="primary" @click="handleAgreeInvitation(index)"
            >同意</el-button
          >
          <el-button @click="handleRejectInvitation(index)">拒绝</el-button>
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
          <p v-if="item.status == GroupInvitationStatus.KICKED">
            <span>管理员</span>
            <span
              class="primary link"
              @click="showStrangerInfo(item.invitedById)"
              >{{ item.invitedByNickname }}</span
            >
            <span
              class="primary link"
              @click="showStrangerInfo(item.invitedById)"
              >({{ item.invitedByUsername }})</span
            >
            <span>将</span>
            <span
              class="primary link"
              @click="showStrangerInfo(item.inviterId)"
              >{{ item.inviterNickname }}</span
            >
            <span class="primary link" @click="showStrangerInfo(item.inviterId)"
              >({{ item.inviterUsername }})</span
            >
            <span>移出群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
          <p v-else-if="item.status == GroupInvitationStatus.QUITED">
            <span
              class="primary link"
              @click="showStrangerInfo(item.inviterId)"
              >{{ item.inviterNickname }}</span
            >
            <span class="primary link" @click="showStrangerInfo(item.inviterId)"
              >({{ item.inviterUsername }})</span
            >
            <span>退出了群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
          <p v-else>
            <span
              class="primary link"
              @click="showStrangerInfo(item.invitedById)"
              >{{ item.invitedByNickname }}</span
            >
            <span
              class="primary link"
              @click="showStrangerInfo(item.invitedById)"
              >({{ item.invitedByUsername }})</span
            >
            <span>邀请</span>
            <span
              class="primary link"
              @click="showStrangerInfo(item.inviterId)"
              >{{ item.inviterNickname }}</span
            >
            <span class="primary link" @click="showStrangerInfo(item.inviterId)"
              >({{ item.inviterUsername }})</span
            >
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
        </div>
        <div
          class="invitation-list-item__button-group"
          v-if="item.status == GroupInvitationStatus.ADMIN_PENDING"
        >
          <el-button type="primary" @click="handleAdminAgreeInvitation(index)"
            >同意</el-button
          >
          <el-button @click="handleAdminRejectInvitation(index)"
            >拒绝</el-button
          >
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
    <StrangerInfoDialog v-model="strangerInfoShow" :stranger-id="strangerId" />
    <GroupDetails v-model="groupInfoShow" :group-id="groupId" />
  </el-dialog>
</template>
<script setup lang="ts">
import {
  adminHandelGroupInvitation,
  getAdminGroupInvitationList,
  getGroupInvitationList,
  userHandelGroupInvitation,
} from '@/api/group';
import {
  GroupInvitationStatus,
  type GroupAdminInvitationVo,
  type GroupInvitationVo,
} from '@/api/group/types';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';
import StrangerInfoDialog from '@/components/user/StrangerInfoDialog.vue';
import { useGroupStore } from '@/stores/group';
import GroupDetails from './GroupDetails.vue';

const dialogVisible = defineModel({ type: Boolean, default: false });
const userStore = useUserStore();
const groupStore = useGroupStore();
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

const strangerInfoShow = ref(false);
const strangerId = ref(0);
const showStrangerInfo = (id: number) => {
  strangerId.value = id;
  strangerInfoShow.value = true;
};
const groupInfoShow = ref(false);
const groupId = ref(0);
const showGroupInfo = (id: number) => {
  groupId.value = id;
  groupInfoShow.value = true;
};

const handleAgreeInvitation = async (index: number) => {
  await userHandelGroupInvitation(
    userStore.userInfo.id,
    invitationList.value[index].groupId,
    true
  );
  invitationList.value[index].status = GroupInvitationStatus.ADMIN_PENDING;
  ElMessage.success('已同意该邀请');
  groupStore.loaded = false;
  groupStore.loadGroupList();
};
const handleRejectInvitation = async (index: number) => {
  await userHandelGroupInvitation(
    userStore.userInfo.id,
    invitationList.value[index].groupId,
    false
  );
  invitationList.value[index].status = GroupInvitationStatus.REJECTED;
  ElMessage.success('已拒绝该邀请');
};

const handleAdminAgreeInvitation = async (index: number) => {
  await adminHandelGroupInvitation(
    adminInvitationList.value[index].inviterId,
    adminInvitationList.value[index].groupId,
    true
  );
  ElMessage.success('已同意该邀请');
  adminInvitationList.value[index].status =
    GroupInvitationStatus.ADMIN_ACCEPTED;
};
const handleAdminRejectInvitation = async (index: number) => {
  await adminHandelGroupInvitation(
    adminInvitationList.value[index].inviterId,
    adminInvitationList.value[index].groupId,
    false
  );
  ElMessage.success('已拒绝该邀请');
  adminInvitationList.value[index].status =
    GroupInvitationStatus.ADMIN_REJECTED;
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
    }
  }
}
</style>
