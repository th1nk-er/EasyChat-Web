<template>
  <div class="setting">
    <div class="setting-item">
      <span class="setting-item-label">群聊设置</span>
      <div class="setting-item-container">
        <el-select
          v-model="selectedGroupId"
          class="setting-item-select"
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
        <el-table :data="groupMemberList" table-layout="auto">
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
          <el-table-column label="身份">
            <template #default="scope">
              <span>{{ getRoleString(scope.row.role) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="加入时间">
            <template #default="scope">
              <span>{{ getTimeString(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button link type="primary">编辑群昵称</el-button>
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
                @click="handleClickMember(scope.row.userId)"
                v-if="
                  userStore.userInfo.id != scope.row.userId &&
                  isUserAdmin(userStore.userInfo.id)
                "
                >踢出</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getGroupMemberList } from '@/api/group';
import type { GroupMemberInfoVo } from '@/api/group/types';
import { useGroupStore } from '@/stores/group';
import { getFileUrl } from '@/utils/file';
import { getTimeString } from '@/utils/timeUtils';
import { getRoleString } from '@/utils/userUtils';
import { SettingType } from './types';
import { useUserStore } from '@/stores/user';
import { UserRole } from '@/api/user/types';
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
const onSelectedGroupChange = (groupId: number) => {
  groupMemberList.value = [];
  if (groupId === -1) return;
  let page = 1;
  const intervalId = setInterval(async () => {
    try {
      const resp = await getGroupMemberList(groupId, page++);
      if (resp.data.length === 0) clearInterval(intervalId);
      groupMemberList.value.push(...resp.data);
    } catch (e) {
      clearInterval(intervalId);
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
const handleClickMember = (userId: number) => {
  //TODO 踢出群聊
};
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
