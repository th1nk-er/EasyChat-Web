<template>
  <el-dialog v-model="dialogVisible" title="创建群组">
    <div class="container">
      <FriendSelectList
        :key="componentKey"
        class="friend-select"
        @on-friend-selected="onFriendSelected"
        @on-friend-selected-cancel="onFriendSelectedCancel"
        ref="friendSelectList"
      />
      <div class="member-selected">
        <div class="subtitle">已选联系人：{{ selectedFriend.length }}</div>
        <div class="member-list">
          <div
            class="member-item"
            v-for="(item, index) in selectedFriend"
            :key="index"
          >
            <img :src="getFileUrl(item.avatar)" class="member-item__avatar" />
            <div class="member-item__name">
              <span v-if="item.remark != undefined && item.remark.length > 0">{{
                item.remark
              }}</span>
              <span v-else>{{ item.nickname }}</span>
              <span>({{ item.username }})</span>
            </div>
            <IconClose class="icon-close" @click="handleRemoveMember(item)" />
          </div>
        </div>
        <el-input v-model="groupName" placeholder="填写群名称" maxlength="20" />
        <div class="button-group">
          <el-button type="primary" @click="handleCreateGroup">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import type { UserFriendVo } from '@/api/friend/types';
import { createGroup } from '@/api/group';
import { useGroupStore } from '@/stores/group';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import FriendSelectList from '../friend/FriendSelectList.vue';
const dialogVisible = defineModel({ type: Boolean, default: false });
const userStore = useUserStore();
const componentKey = ref(0);
watch(dialogVisible, (value) => {
  if (value) {
    //初始化数据
    componentKey.value++;
    selectedFriend.value = [];
    groupName.value = '';
  }
});
const groupStore = useGroupStore();
const friendSelectList = ref<typeof FriendSelectList | null>(null);
const selectedFriend = ref([] as UserFriendVo[]);
const onFriendSelected = (friend: UserFriendVo) => {
  selectedFriend.value.push(friend);
};
const onFriendSelectedCancel = (friend: UserFriendVo) => {
  selectedFriend.value = selectedFriend.value.filter(
    (item) => item.friendId !== friend.friendId
  );
};
const handleRemoveMember = (friend: UserFriendVo) => {
  friendSelectList.value?.selectCancel(friend);
  onFriendSelectedCancel(friend);
};
const groupName = ref('');
const handleCreateGroup = async () => {
  if (groupName.value.trim().length == 0) {
    ElMessage.error('群名称不能为空');
    return;
  }
  if (selectedFriend.value.length == 0) {
    ElMessage.error('群成员不能为空');
  }
  const ids = selectedFriend.value.map((item) => item.friendId);
  await createGroup(userStore.userInfo.id, groupName.value, ids);
  ElMessage.success('群聊创建成功');
  dialogVisible.value = false;
  groupStore.loadGroupList();
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  gap: 10px;
  height: 400px;
  .friend-select {
    width: 50%;
  }
  .member-selected {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .subtitle {
      color: var(--color-subtitle);
    }
    .member-list {
      flex-grow: 1;
      overflow-y: scroll;
      .member-item {
        display: flex;
        align-items: center;
        padding: 5px;
        gap: 5px;
        transition: all 0.3s;
        &:hover {
          background-color: var(--color-background-mute);
          .icon-close {
            display: block;
          }
        }
        &__avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        &__name {
          flex-grow: 1;
          span {
            font-weight: bold;
          }
        }
        .icon-close {
          display: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          fill: var(--color-background-mute);
          background-color: var(--color-subtitle);
          transition: all 0.3s;
          opacity: 0.6;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
