<template>
  <el-dialog v-model="dialogVisible" title="群通知">
    <div class="container">
      <h2 v-show="notificationList.length === 0" style="text-align: center">
        无数据
      </h2>
      <div
        class="invitation-list-item"
        v-for="(item, index) in notificationList"
        :key="index"
      >
        <img
          :src="getFileUrl(item.groupAvatar)"
          alt=""
          class="invitation-list-item__avatar"
        />
        <div class="invitation-list-item__content">
          <p v-if="item.type == GroupNotificationType.KICKED">
            <span v-if="item.operatorId == userStore.userInfo.id">你</span>
            <span v-else
              ><span>管理员</span>
              <span
                class="primary link"
                @click="showUserInfo(item.operatorId)"
                >{{ item.operatorNickname }}</span
              >
              <span class="primary link" @click="showUserInfo(item.operatorId)"
                >({{ item.operatorUsername }})</span
              ></span
            >
            <span>将</span>
            <span v-if="item.targetId == userStore.userInfo.id">你</span>
            <span v-else>
              <span class="primary link" @click="showUserInfo(item.targetId)">{{
                item.targetNickname
              }}</span>
              <span class="primary link" @click="showUserInfo(item.targetId)"
                >({{ item.targetUsername }})</span
              >
            </span>
            <span>移出群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
          <p v-else-if="item.type == GroupNotificationType.QUITED">
            <span v-if="item.targetId == userStore.userInfo.id">你</span>
            <span v-else>
              <span class="primary link" @click="showUserInfo(item.targetId)">{{
                item.targetNickname
              }}</span>
              <span class="primary link" @click="showUserInfo(item.targetId)"
                >({{ item.targetUsername }})</span
              >
            </span>
            <span>退出了群聊</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
          <p v-else-if="item.type == GroupNotificationType.SET_ADMIN">
            <span v-if="item.operatorId == userStore.userInfo.id">你</span>
            <span v-else>管理员</span>
            <span
              class="primary link"
              v-if="item.operatorId != userStore.userInfo.id"
              @click="showUserInfo(item.operatorId)"
              >{{ item.operatorNickname }}</span
            >
            <span
              class="primary link"
              v-if="item.operatorId != userStore.userInfo.id"
              @click="showUserInfo(item.operatorId)"
              >({{ item.operatorUsername }})</span
            >
            <span>将</span>
            <span v-if="item.targetId == userStore.userInfo.id">你</span>
            <span v-else>
              <span class="primary link" @click="showUserInfo(item.targetId)">{{
                item.targetNickname
              }}</span>
              <span class="primary link" @click="showUserInfo(item.targetId)"
                >({{ item.targetUsername }})</span
              >
            </span>
            <span>设为群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
            <span>的管理员</span>
          </p>
          <p v-else-if="item.type == GroupNotificationType.CANCEL_ADMIN">
            <span v-if="item.operatorId == userStore.userInfo.id">你</span>
            <span v-else>管理员</span>
            <span
              class="primary link"
              v-if="item.operatorId != userStore.userInfo.id"
              @click="showUserInfo(item.operatorId)"
              >{{ item.operatorNickname }}</span
            >
            <span
              class="primary link"
              v-if="item.operatorId != userStore.userInfo.id"
              @click="showUserInfo(item.operatorId)"
              >({{ item.operatorUsername }})</span
            >
            <span>取消了</span>
            <span v-if="item.targetId == userStore.userInfo.id">你</span>
            <span v-else>
              <span class="primary link" @click="showUserInfo(item.targetId)">{{
                item.targetNickname
              }}</span>
              <span class="primary link" @click="showUserInfo(item.targetId)"
                >({{ item.targetUsername }})</span
              >
            </span>
            <span>在群组</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
            <span>的管理员权限</span>
          </p>
          <p v-else>
            <span v-if="item.operatorId == userStore.userInfo.id">你</span>
            <span v-else>
              <span
                class="primary link"
                @click="showUserInfo(item.operatorId)"
                >{{ item.operatorNickname }}</span
              >
              <span class="primary link" @click="showUserInfo(item.operatorId)"
                >({{ item.operatorUsername }})</span
              >
            </span>
            <span>邀请</span>
            <span v-if="item.targetId == userStore.userInfo.id">你</span>
            <span v-else>
              <span class="primary link" @click="showUserInfo(item.targetId)">{{
                item.targetNickname
              }}</span>
              <span class="primary link" @click="showUserInfo(item.targetId)"
                >({{ item.targetUsername }})</span
              >
            </span>
            <span>加入群聊</span>
            <span class="primary link" @click="showGroupInfo(item.groupId)">{{
              item.groupName
            }}</span>
          </p>
          <p class="invitation-list-item__time">
            {{ getTimeString(item.createTime) }}
          </p>
        </div>
        <div
          class="invitation-list-item__button-group"
          v-if="item.type == GroupNotificationType.PENDING"
        >
          <el-button type="primary" @click="handleAgreeInvitation(index)"
            >同意</el-button
          >
          <el-button @click="handleRejectInvitation(index)">拒绝</el-button>
        </div>
        <div
          class="invitation-list-item__button-group"
          v-else-if="
            item.type == GroupNotificationType.ADMIN_PENDING &&
            item.targetId != userStore.userInfo.id
          "
        >
          <el-button type="primary" @click="handleAdminAgreeInvitation(index)"
            >同意</el-button
          >
          <el-button @click="handleAdminRejectInvitation(index)"
            >拒绝</el-button
          >
        </div>
        <div class="invitation-list-item__status" v-else>
          <span v-if="item.type == GroupNotificationType.REJECTED">已拒绝</span>
          <span v-if="item.type == GroupNotificationType.ADMIN_ACCEPTED"
            >管理员已同意</span
          >
          <span v-if="item.type == GroupNotificationType.ADMIN_REJECTED"
            >管理员已拒绝</span
          >
          <span v-if="item.type == GroupNotificationType.ADMIN_PENDING"
            >等待管理员处理</span
          >
          <span v-if="item.type == GroupNotificationType.EXPIRED">已过期</span>
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
  adminhandleGroupInvitation,
  getGroupInvitationList,
  userhandleGroupInvitation,
} from '@/api/group';
import {
  GroupNotificationType,
  type GroupNotificationVo,
} from '@/api/group/types';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import FriendInfoDialog from '@/components/friend/FriendInfoDialog.vue';
import StrangerInfoDialog from '@/components/user/StrangerInfoDialog.vue';
import { useGroupStore } from '@/stores/group';
import GroupDetails from './GroupDetails.vue';
import { useFriendStore } from '@/stores/friend';
import { getTimeString } from '@/utils/timeUtils';

const dialogVisible = defineModel({ type: Boolean, default: false });
const userStore = useUserStore();
const groupStore = useGroupStore();
const friendStore = useFriendStore();
watch(dialogVisible, (value) => {
  if (value) {
    notificationList.value = [];
    currentPage.value = 1;
    hasMoreData.value = true;
    loadData();
  }
});
const currentPage = ref(1);
const hasMoreData = ref(true);
const notificationList = ref<GroupNotificationVo[]>([]);
const loadData = async () => {
  const resp = await getGroupInvitationList(
    userStore.userInfo.id,
    currentPage.value++
  );
  if (resp.data.length > 0) notificationList.value.push(...resp.data);
  else hasMoreData.value = false;
};
const friendId = ref(0);
const friendInfoShow = ref(false);

const strangerInfoShow = ref(false);
const strangerId = ref(0);
const showUserInfo = (id: number) => {
  const friend = friendStore.getFriendVoById(id);
  if (friend) {
    friendId.value = id;
    friendInfoShow.value = true;
  } else {
    strangerId.value = id;
    strangerInfoShow.value = true;
  }
};
const groupInfoShow = ref(false);
const groupId = ref(0);
const showGroupInfo = (id: number) => {
  groupId.value = id;
  groupInfoShow.value = true;
};

const handleAgreeInvitation = async (index: number) => {
  await userhandleGroupInvitation(
    userStore.userInfo.id,
    notificationList.value[index].groupId,
    true
  );
  notificationList.value[index].type = GroupNotificationType.ADMIN_PENDING;
  ElMessage.success('已同意该邀请');
  groupStore.loaded = false;
  groupStore.loadGroupList();
};
const handleRejectInvitation = async (index: number) => {
  await userhandleGroupInvitation(
    userStore.userInfo.id,
    notificationList.value[index].groupId,
    false
  );
  notificationList.value[index].type = GroupNotificationType.REJECTED;
  ElMessage.success('已拒绝该邀请');
};

const handleAdminAgreeInvitation = async (index: number) => {
  await adminhandleGroupInvitation(
    notificationList.value[index].targetId,
    notificationList.value[index].groupId,
    true
  );
  ElMessage.success('已同意该邀请');
  notificationList.value[index].type = GroupNotificationType.ADMIN_ACCEPTED;
};
const handleAdminRejectInvitation = async (index: number) => {
  await adminhandleGroupInvitation(
    notificationList.value[index].targetId,
    notificationList.value[index].groupId,
    false
  );
  ElMessage.success('已拒绝该邀请');
  notificationList.value[index].type = GroupNotificationType.ADMIN_REJECTED;
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: scroll;
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
    &__time {
      color: var(--color-subtitle);
    }
  }
}
</style>
