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
        <h4 style="text-align: center">成员列表</h4>
        <el-table
          :data="groupMemberList"
          table-layout="auto"
          v-loading="isLoading"
        >
          <el-table-column fixed label="用户名">
            <template #default="scope">
              <div style="display: flex; align-items: center; gap: 5px">
                <el-avatar :src="getFileUrl(scope.row.avatar)" size="small" />
                <span>{{ scope.row.username }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称" />
          <el-table-column prop="userGroupNickname" label="群昵称" />
          <el-table-column label="性别">
            <template #default="scope">
              <UserSexIcon :sex="scope.row.sex" :size="18" />
            </template>
          </el-table-column>
          <el-table-column label="身份">
            <template #default="scope">
              <span
                v-if="
                  scope.row.userId == userStore.userInfo.id ||
                  scope.row.role == UserRole.LEADER ||
                  !isUserAdmin(userStore.userInfo.id)
                "
                >{{ getRoleString(scope.row.role) }}</span
              >
              <el-select
                v-else
                v-model="scope.row.role"
                @change="handleRoleChange($event, scope.row.userId)"
              >
                <el-option
                  :label="getRoleString(UserRole.ADMIN)"
                  :value="UserRole.ADMIN"
                />
                <el-option
                  :label="getRoleString(UserRole.USER)"
                  :value="UserRole.USER"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="加入时间">
            <template #default="scope">
              <span>{{ getTimeString(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                v-if="
                  userStore.userInfo.id == scope.row.userId ||
                  (isUserAdmin(userStore.userInfo.id) &&
                    !isUserLeader(scope.row.userId))
                "
                @click="handleChangeUserGroupNickname(scope.row.userId)"
                >编辑群昵称</el-button
              >
              <el-button
                link
                type="danger"
                v-if="
                  userStore.userInfo.id != scope.row.userId &&
                  isUserAdmin(userStore.userInfo.id)
                "
                >禁言</el-button
              >
              <el-button
                link
                type="danger"
                @click="handleKickMember(scope.row.userId)"
                v-if="
                  userStore.userInfo.id != scope.row.userId &&
                  isUserAdmin(userStore.userInfo.id)
                "
                >踢出</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="group-btn" v-show="selectedGroupId != -1">
          <el-button type="primary" @click="inviteDialogShow = true"
            >邀请成员</el-button
          >
          <div class="divider"></div>
          <el-button type="danger" v-if="isUserLeader(userStore.userInfo.id)"
            >解散群组</el-button
          >
          <el-button type="danger" v-else>退出群组</el-button>
        </div>
      </div>
    </div>
    <InviteGroupMemberDialog
      v-model="inviteDialogShow"
      :group-id="selectedGroupId"
      :member-list="groupMemberList"
    />
    <EditUserGroupNicknameDialog
      v-model="editNicknameDialogShow"
      :groupId="selectedGroupId"
      :userId="selectedUserId"
      :nickname="
        groupMemberList.find((member) => member.userId == selectedUserId)
          ?.userGroupNickname
      "
      @onNicknameChanged="onUserGroupNicknameChanged"
    />
  </div>
</template>
<script setup lang="ts">
import {
  getGroupMemberList,
  kickGroupMember,
  updateUserGroupRole,
} from '@/api/group';
import type { GroupMemberInfoVo } from '@/api/group/types';
import { useGroupStore } from '@/stores/group';
import { getFileUrl } from '@/utils/file';
import { getTimeString } from '@/utils/timeUtils';
import { getRoleString } from '@/utils/userUtils';
import { SettingType } from './types';
import { useUserStore } from '@/stores/user';
import { UserRole } from '@/api/user/types';
import UserSexIcon from '@/components/user/UserSexIcon.vue';
import InviteGroupMemberDialog from '@/components/group/InviteGroupMemberDialog.vue';
import EditUserGroupNicknameDialog from '@/components/group/EditUserGroupNicknameDialog.vue';
import type { VNode } from 'vue';
const groupStore = useGroupStore();
const userStore = useUserStore();
const route = useRoute();

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
const onSelectedGroupChange = (groupId: number) => {
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
const isUserAdmin = (userId: number) => {
  const member = groupMemberList.value.find((member) => {
    if (member.userId == userId)
      return member.role === UserRole.ADMIN || member.role === UserRole.LEADER;
  });
  if (member) return true;
  return false;
};
/** 判断用户是否拥有群主权限 */
const isUserLeader = (userId: number) => {
  const member = groupMemberList.value.find((member) => {
    if (member.userId == userId) return member.role === UserRole.LEADER;
  });
  if (member) return true;
};
const handleKickMember = (userId: number) => {
  ElMessageBox.confirm('确定将该群员踢出群聊吗？', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await kickGroupMember(
        userStore.userInfo.id,
        selectedGroupId.value,
        userId
      );
      ElMessage.success('操作成功');
      onSelectedGroupChange(selectedGroupId.value);
    })
    .catch(() => {});
};
const inviteDialogShow = ref(false);

const editNicknameDialogShow = ref(false);
const selectedUserId = ref(-1);

/** 打开修改群昵称对话框，修改用户群昵称 */
const handleChangeUserGroupNickname = (userId: number) => {
  selectedUserId.value = userId;
  editNicknameDialogShow.value = true;
};
/**
 * 回调函数，当用户群昵称修改成功时调用
 * @param nickname 群昵称
 */
const onUserGroupNicknameChanged = (nickname: string) => {
  const member = groupMemberList.value.find(
    (member) => member.userId == selectedUserId.value
  );
  if (member) member.userGroupNickname = nickname;
};

/**
 * 处理用户身份改变
 * @param role 改变后的身份
 * @param userId 用户id
 */
const handleRoleChange = (role: UserRole, userId: number) => {
  let msg: VNode;
  if (role == UserRole.ADMIN) {
    msg = h('p', [
      h('span', null, '确定将用户'),
      h(
        'span',
        { style: 'color:var(--el-color-primary)' },
        `${groupMemberList.value.find((member) => member.userId == userId)?.username}`
      ),
      h('span', null, '设为管理员？'),
    ]);
  } else if (role == UserRole.USER) {
    msg = h('p', [
      h('span', null, '确定撤销用户'),
      h(
        'span',
        { style: 'color:var(--el-color-primary)' },
        `${groupMemberList.value.find((member) => member.userId == userId)?.username}`
      ),
      h('span', null, '的管理员身份？'),
    ]);
  } else {
    return;
  }
  ElMessageBox.confirm(msg, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await updateUserGroupRole(
        userStore.userInfo.id,
        selectedGroupId.value,
        userId,
        role
      );
      ElMessage.success('操作成功');
    })
    .catch(() => {
      // 取消操作
      if (role == UserRole.ADMIN) {
        groupMemberList.value.find((member) => member.userId == userId)!.role =
          UserRole.USER;
      } else if (role == UserRole.USER) {
        groupMemberList.value.find((member) => member.userId == userId)!.role =
          UserRole.ADMIN;
      }
    });
};
</script>
<style lang="scss" scoped>
@import './style.scss';
.group-btn {
  display: flex;
  .divider {
    flex: 1;
  }
}
</style>
