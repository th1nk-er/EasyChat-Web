<template>
  <el-dialog v-model="dialogVisible" width="30%">
    <div class="container">
      <img :src="getFileUrl(memberInfo.avatar)" class="avatar" />
      <el-divider />
      <div class="info-container">
        <div class="info-item">
          <span class="info-item__label"
            >昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</span
          >
          <span class="info-item__content">{{ memberInfo.nickname }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label">群&nbsp;&nbsp;昵&nbsp;&nbsp;称</span>
          <span class="info-item__content">{{
            memberInfo.userGroupNickname
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >身&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份</span
          >
          <span class="info-item__content">{{
            getRoleString(memberInfo.role)
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >屏&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;蔽</span
          >
          <el-switch v-model="isIgnored" @change="handleIgnoredChange" />
        </div>
        <div class="info-item">
          <span class="info-item__label">用&nbsp;&nbsp;户&nbsp;&nbsp;名</span>
          <span class="info-item__content">{{ memberInfo.username }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span
          >
          <UserSexIcon :sex="memberInfo.sex" />
        </div>
        <div class="info-item">
          <span class="info-item__label">加入时间</span>
          <span class="info-item__content">{{
            getTimeString(memberInfo.createTime)
          }}</span>
        </div>
      </div>
      <el-divider />
      <span v-if="muteInfo.muted"
        >禁言中，剩余{{
          getDurationString(new Date().toISOString(), muteInfo.unmuteTime)
        }}</span
      >
      <div class="button-group">
        <el-button
          type="primary"
          @click="addInfoDialogVisible = true"
          v-if="friendStore.getFriendVoById(props.userId) == undefined"
          >添加好友</el-button
        >
        <el-button type="primary" @click="handleStartConversation" v-else
          >发起对话</el-button
        >
        <el-button
          type="danger"
          v-if="
            groupStore.isMemberAdmin(props.groupId, userStore.userInfo.id) &&
            !muteInfo.muted
          "
          @click="muteDialogShow = true"
          >设置禁言</el-button
        >
        <el-button
          type="danger"
          v-if="
            groupStore.isMemberAdmin(props.groupId, userStore.userInfo.id) &&
            muteInfo.muted
          "
          @click="handleCancelMute"
          >解除禁言</el-button
        >
        <el-button
          type="danger"
          v-if="groupStore.isMemberAdmin(props.groupId, userStore.userInfo.id)"
          @click="handleKickMember"
          >踢出群聊</el-button
        >
        <AddFriendInfoDialog
          v-model="addInfoDialogVisible"
          :add-id="props.userId"
        />
      </div>
    </div>
  </el-dialog>
  <MuteMemberDialog v-model="muteDialogShow" @onMemberMute="handleMuteMember" />
</template>

<script lang="ts" setup>
import AddFriendInfoDialog from '@/components/friend/AddFriendInfoDialog.vue';
import MuteMemberDialog from '@/components/group/MuteMemberDialog.vue';
import type { GroupMemberInfoVo, GroupMemberMuteVo } from '@/api/group/types';
import { useGroupStore } from '@/stores/group';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import { getRoleString } from '@/utils/userUtils';
import { getDurationString, getTimeString } from '@/utils/timeUtils';
import UserSexIcon from '@/components/user/UserSexIcon.vue';
import {
  cancelIgnoreGroupMember,
  cancelMuteGroupMember,
  getGroupIgnored,
  getGroupMemberMuteInfo,
  ignoreGroupMember,
  kickGroupMember,
  muteGroupMember,
} from '@/api/group';
import { useFriendStore } from '@/stores/friend';
import { useChatStore } from '@/stores/chat';
import { ChatType } from '@/api/chat/types';

const dialogVisible = defineModel({ type: Boolean, default: false });
const emit = defineEmits<{
  onMemberIgnoreChanged: [newVal: boolean];
}>();
const props = defineProps({
  userId: { type: Number, required: true },
  groupId: { type: Number, required: true },
});
watch(dialogVisible, (val) => {
  if (val) {
    loadData();
  }
});
const router = useRouter();
const groupStore = useGroupStore();
const friendStore = useFriendStore();
const chatStore = useChatStore();
const userStore = useUserStore();
const memberInfo = ref({ sex: 'SECRET' } as GroupMemberInfoVo);
const addInfoDialogVisible = ref(false);
const isIgnored = ref(false);
const muteInfo = ref({} as GroupMemberMuteVo);
const loadData = async () => {
  if (memberInfo.value.userId == props.userId) return;
  const info = await groupStore.getMemberInfo(props.groupId, props.userId);
  const resp = await getGroupIgnored(userStore.userInfo.id, props.groupId);
  isIgnored.value =
    resp.data.find((item) => item.ignoredId === props.userId) !== undefined;
  const muteResp = await getGroupMemberMuteInfo(props.groupId, props.userId);
  if (muteResp.data) {
    muteInfo.value = muteResp.data;
  }
  if (info) {
    memberInfo.value = info;
  } else {
    ElMessage.error('获取信息失败');
  }
};
const handleIgnoredChange = async () => {
  if (isIgnored.value) {
    await ignoreGroupMember(userStore.userInfo.id, props.groupId, props.userId);
    emit('onMemberIgnoreChanged', true);
  } else {
    await cancelIgnoreGroupMember(
      userStore.userInfo.id,
      props.groupId,
      props.userId
    );
    emit('onMemberIgnoreChanged', false);
  }
};
const handleKickMember = async () => {
  ElMessageBox.confirm('确定将该群员踢出群聊吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await kickGroupMember(userStore.userInfo.id, props.groupId, props.userId);
      ElMessage.success('操作成功');
      dialogVisible.value = false;
    })
    .catch(() => {});
};

const muteDialogShow = ref(false);
const handleMuteMember = async (minutes: number) => {
  await muteGroupMember({
    groupId: props.groupId,
    memberId: props.userId,
    adminId: userStore.userInfo.id,
    duration: minutes,
  });
  ElMessage.success('操作成功');
  muteDialogShow.value = false;
  muteInfo.value.muted = true;
  muteInfo.value.unmuteTime = new Date(
    new Date().getTime() + minutes * 60 * 1000
  ).toISOString();
  muteInfo.value.groupId = props.groupId;
  muteInfo.value.userId = props.userId;
  muteInfo.value.adminId = userStore.userInfo.id;
  muteInfo.value.muteTime = new Date().toISOString();
};

const handleCancelMute = async () => {
  await ElMessageBox.confirm('确定解除该成员的禁言吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await cancelMuteGroupMember(
    props.groupId,
    props.userId,
    userStore.userInfo.id
  );
  ElMessage.success('操作成功');
  muteInfo.value.muted = false;
};
const handleStartConversation = () => {
  router.push({ name: 'Chat' });
  chatStore.chatId = props.userId;
  chatStore.isChatting = true;
  chatStore.chatType = ChatType.FRIEND;
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar {
    border-radius: 10px;
    width: 120px;
    height: 120px;
  }
  .info-container {
    display: flex;
    flex-direction: column;
    width: 95%;

    .info-item {
      display: flex;
      width: 100%;
      font-size: 18px;
      align-items: center;
      &__label {
        width: 30%;
        color: var(--color-subtitle);
      }
      &__content {
        color: var(--color-text);
      }
    }
  }
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
}
</style>
