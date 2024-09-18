<template>
  <el-dialog v-model="dialogVisible" width="35%">
    <div class="container">
      <div class="avatar">
        <img :src="getFileUrl(groupInfo.avatar)" class="img-avatar" />
      </div>
      <el-divider />
      <div class="info-container">
        <div class="info-item">
          <span class="info-item__label">群聊名称</span>
          <span class="info-item__content">{{ groupInfo.groupName }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label">群聊简介</span>
          <span class="info-item__content">{{ groupInfo.groupDesc }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label">群聊备注</span>
          <span class="info-item__content" v-show="!editRemarkShow">{{
            groupInfo.groupRemark
          }}</span>
          <IconEdit
            class="icon-edit"
            v-show="!editRemarkShow"
            @click="
              editRemarkShow = true;
              remarkInputRef?.focus();
            "
          />
          <el-input
            v-model="groupInfo.groupRemark"
            maxlength="20"
            v-show="editRemarkShow"
            ref="remarkInputRef"
            @blur="editRemarkShow = false"
            style="width: 30%"
          />
        </div>
        <div class="info-item">
          <span class="info-item__label">免&nbsp;&nbsp;打&nbsp;&nbsp;扰</span>
          <el-switch v-model="groupInfo.muted" />
        </div>
      </div>
      <el-divider />
      <div class="info-item-button-group">
        <el-button
          class="button"
          type="primary"
          @click="handleUpdateUserGroupInfo"
          >保存修改</el-button
        >
        <el-button class="button" type="primary" @click="handleSendMessage"
          >发送消息</el-button
        >
        <el-button class="button" type="danger" @click="handleQuitGroup"
          >退出群组</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ChatType } from '@/api/chat/types';
import { updateUserGroupInfo } from '@/api/group';
import type { UserGroupVo } from '@/api/group/types';
import { useChatStore } from '@/stores/chat';
import { useGroupStore } from '@/stores/group';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';

const dialogVisible = defineModel({ type: Boolean, default: false });
const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
});
watch(dialogVisible, (value) => {
  if (value) {
    loadData();
  }
});
const router = useRouter();
const userStore = useUserStore();
const groupStore = useGroupStore();
const chatStore = useChatStore();
const groupInfo = ref({} as UserGroupVo);
const loadData = () => {
  const userGroupVo = groupStore.getUserVoById(props.groupId);
  if (userGroupVo) {
    groupInfo.value = { ...userGroupVo };
  }
};
const editRemarkShow = ref(false);
const remarkInputRef = ref<HTMLInputElement>();
const handleUpdateUserGroupInfo = async () => {
  // 检测是否有修改
  if (
    groupInfo.value.groupRemark ===
      groupStore.getUserVoById(props.groupId)?.groupRemark &&
    groupInfo.value.muted === groupStore.getUserVoById(props.groupId)?.muted
  ) {
    return;
  } else {
    // 存在修改内容，发起更新请求
    await updateUserGroupInfo(userStore.userInfo.id, {
      groupId: props.groupId,
      groupRemark: groupInfo.value.groupRemark,
      muted: groupInfo.value.muted,
    });
    ElMessage.success('修改成功');
    groupStore.loadGroupList();
  }
  dialogVisible.value = false;
};
const handleSendMessage = () => {
  chatStore.chatId = props.groupId;
  chatStore.isChatting = true;
  chatStore.chatType = ChatType.GROUP;
  router.push({ name: 'Chat' });
};
const handleQuitGroup = () => {
  //TODO 退出群组
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .avatar {
    .img-avatar {
      border-radius: 10px;
      width: 120px;
      height: 120px;
    }
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
        width: 20%;
        color: var(--color-subtitle);
      }
      &__content {
        color: var(--color-text);
      }
      .icon-edit {
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          fill: var(--color-subtitle);
        }
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
