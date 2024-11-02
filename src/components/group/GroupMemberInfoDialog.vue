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
      <div class="button-group">
        <el-button type="primary" @click="addInfoDialogVisible = true"
          >添加好友</el-button
        >
        <el-button
          type="danger"
          v-if="groupStore.isMemberAdmin(props.groupId, userStore.userInfo.id)"
          >设置禁言</el-button
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
</template>

<script lang="ts" setup>
import AddFriendInfoDialog from '@/components/friend/AddFriendInfoDialog.vue';
import type { GroupMemberInfoVo } from '@/api/group/types';
import { useGroupStore } from '@/stores/group';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import { getRoleString } from '@/utils/userUtils';
import { getTimeString } from '@/utils/timeUtils';
import UserSexIcon from '@/components/user/UserSexIcon.vue';
import {
  cancelIgnoreGroupMember,
  getGroupIgnored,
  ignoreGroupMember,
  kickGroupMember,
} from '@/api/group';

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
const groupStore = useGroupStore();
const userStore = useUserStore();
const memberInfo = ref({} as GroupMemberInfoVo);
const addInfoDialogVisible = ref(false);
const isIgnored = ref(false);
const loadData = async () => {
  if (memberInfo.value.userId == props.userId) return;
  const info = await groupStore.getMemberInfo(props.groupId, props.userId);
  const resp = await getGroupIgnored(userStore.userInfo.id, props.groupId);
  isIgnored.value =
    resp.data.find((item) => item.ignoredId === props.userId) !== undefined;
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
  ElMessageBox.confirm('确定将该群员踢出群聊吗？', 'Warning', {
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
      &-button-group {
        display: flex;
        justify-content: space-between;
        .button {
          width: 30%;
        }
      }
    }
  }
}
</style>
