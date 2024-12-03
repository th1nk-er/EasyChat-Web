<template>
  <div class="setting">
    <div class="setting-item">
      <span class="setting-item-label">群聊设置</span>
      <div class="setting-item-container">
        <el-select
          v-model="selectedGroupId"
          class="setting-item-select"
          :disabled="isLoading"
          @change="onSelectedGroupChange"
        >
          <el-option label="请选择群聊" :value="-1" />
          <el-option
            v-for="group in groupStore.groupList"
            :key="group.groupId"
            :label="group.groupName"
            :value="group.groupId"
          >
            <div style="display: flex; align-items: center">
              <el-avatar :src="getFileUrl(group.avatar)" size="small" />
              <span style="margin-left: 10px">{{ group.groupName }}</span>
            </div>
          </el-option>
        </el-select>
        <h4 style="text-align: center">群聊信息</h4>
        <div class="group-info" v-if="selectedGroupId != -1">
          <div class="group-info__avatar">
            <el-avatar
              shape="square"
              :size="100"
              :src="getFileUrl(groupInfo.avatar)"
            />
            <IconAddAPhoto
              class="icon-add-a-photo"
              v-if="isUserAdmin()"
              @click="avatarUploader?.click()"
            />
            <input
              type="file"
              hidden
              ref="avatarUploader"
              multiple="false"
              accept="image/*"
              @change="handleAvatarUpload"
            />
          </div>
          <div class="group-info__detail">
            <div class="group-info__detail-item">
              <span class="group-info__detail-item-label"> 群聊名称： </span>
              <el-input
                :disabled="!isUserAdmin()"
                minlength="1"
                maxlength="20"
                class="group-info__detail-item-value"
                v-model="groupInfo.groupName"
                placeholder="请输入群聊名称"
              />
            </div>
            <div class="group-info__detail-item">
              <span class="group-info__detail-item-label"> 群聊简介： </span>
              <el-input
                :disabled="!isUserAdmin()"
                maxlength="150"
                type="textarea"
                class="group-info__detail-item-value"
                v-model="groupInfo.groupDesc"
                placeholder="请输入群聊简介"
              />
            </div>
            <div class="group-info__detail-item">
              <el-button
                type="primary"
                v-if="isUserAdmin()"
                @click="handleUpdateGroupInfo"
                >保存</el-button
              >
            </div>
          </div>
        </div>
        <el-divider />
        <h4 style="text-align: center">成员列表</h4>
        <GroupMemberTable :group-id="selectedGroupId" />
        <div class="group-btn" v-show="selectedGroupId != -1">
          <el-button type="primary" @click="inviteDialogShow = true"
            >邀请成员</el-button
          >
          <div class="divider"></div>
          <el-button type="danger" v-if="isUserLeader()">解散群组</el-button>
          <el-button type="danger" v-else @click="handleQuitGroup"
            >退出群组</el-button
          >
        </div>
      </div>
    </div>
    <InviteGroupMemberDialog
      v-model="inviteDialogShow"
      :group-id="selectedGroupId"
      :member-list="groupMemberList"
    />
  </div>
</template>
<script setup lang="ts">
import {
  getGroupMemberList,
  updateGroupAvatar,
  updateGroupInfo,
  quitGroup,
} from '@/api/group';
import type { GroupMemberInfoVo, UserGroupVo } from '@/api/group/types';
import { useGroupStore } from '@/stores/group';
import { getFileUrl } from '@/utils/file';
import { SettingType } from './components/types';
import { useUserStore } from '@/stores/user';
import { UserRole } from '@/api/user/types';
import InviteGroupMemberDialog from '@/components/group/InviteGroupMemberDialog.vue';
import { useChatStore } from '@/stores/chat';
import { ChatType } from '@/api/chat/types';
import { GroupMemberTable } from './components';
const groupStore = useGroupStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const route = useRoute();
const groupInfo = ref({} as UserGroupVo);
const avatarUploader = ref<HTMLInputElement>();
onMounted(() => {
  groupStore.loadGroupList();
  if (route.params.settingType == SettingType.GROUP) {
    if (route.query.id) {
      const groupId = parseInt(route.query.id as string);
      selectedGroupId.value = groupId;
      onSelectedGroupChange(groupId);
    }
  }
});
const selectedGroupId = ref(-1);
const groupMemberList = ref([] as GroupMemberInfoVo[]);
const isLoading = ref(false);
const onSelectedGroupChange = async (groupId: number) => {
  groupInfo.value = { ...groupStore.getUserGroupVoById(groupId)! };
  groupMemberList.value = [];
  if (groupId === -1) return;
  let page = 1;
  isLoading.value = true;
  const intervalId = setInterval(async () => {
    try {
      const resp = await getGroupMemberList(groupId, page++);
      if (resp.data.length === 0) clearInterval(intervalId);
      groupMemberList.value.push(...resp.data);
      isLoading.value = false;
    } catch (e) {
      clearInterval(intervalId);
      isLoading.value = false;
    }
  }, 200);
};
/** 判断用户是否拥有管理员权限 */
const isUserAdmin = () => {
  return (
    groupInfo.value.role === UserRole.LEADER ||
    groupInfo.value.role === UserRole.ADMIN
  );
};
/** 判断用户是否拥有群主权限 */
const isUserLeader = () => {
  return groupInfo.value.role === UserRole.LEADER;
};
const inviteDialogShow = ref(false);
const handleAvatarUpload = async () => {
  const file = avatarUploader.value?.files?.[0];
  if (file == undefined) return;
  if (file.size > 1024 * 1024 * 5) {
    ElMessage.error('头像图片过大,请更换其他图片');
    return;
  }
  const resp = await updateGroupAvatar(
    userStore.userInfo.id,
    selectedGroupId.value,
    file
  );
  const groupVo = groupStore.getUserGroupVoById(selectedGroupId.value);
  if (groupVo) groupVo.avatar = resp.data;
  groupInfo.value.avatar = resp.data;
  chatStore.updateGroupConversation(groupInfo.value);
  ElMessage.success('头像上传成功');
};
const handleUpdateGroupInfo = async () => {
  if (!groupInfo.value.groupDesc) groupInfo.value.groupDesc = '';
  const oldInfo = groupStore.getUserGroupVoById(selectedGroupId.value);
  if (oldInfo) {
    if (
      oldInfo.groupName == groupInfo.value.groupName &&
      oldInfo.groupDesc == groupInfo.value.groupDesc
    ) {
      ElMessage.info('未修改任何信息');
      return;
    }
  }
  await updateGroupInfo(selectedGroupId.value, {
    userId: userStore.userInfo.id,
    groupName: groupInfo.value.groupName,
    groupDesc: groupInfo.value.groupDesc,
  });
  chatStore.updateGroupConversation(groupInfo.value);
  ElMessage.success('修改群聊信息成功');
};
const handleQuitGroup = async () => {
  await ElMessageBox.confirm('确定退出该群组？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await quitGroup(userStore.userInfo.id, selectedGroupId.value);
  ElMessage.success('操作成功');
  groupStore.loadGroupList();
  chatStore.deleteConversation(selectedGroupId.value, ChatType.GROUP);
  selectedGroupId.value = -1;
};
</script>
<style lang="scss" scoped>
@import './components/style.scss';
.group-btn {
  display: flex;
  .divider {
    flex: 1;
  }
}
.group-info {
  display: flex;
  gap: 20px;
  width: 100%;
  &__avatar {
    .icon-add-a-photo {
      border-radius: 3px;
      padding: 2px;
      fill: white;
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      transform: translateX(-25px) translateY(75px);
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.6);
      }
    }
  }
  &__detail {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 10px;
    &-item {
      display: flex;
      align-items: center;
      &-label {
        color: var(--color-subtitle);
      }
      &-value {
        width: 50%;
      }
    }
  }
}
</style>
