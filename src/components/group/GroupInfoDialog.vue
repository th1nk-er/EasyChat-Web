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
          <el-switch
            :disabled="groupInfo.status == GroupStatus.DISBAND"
            v-model="groupInfo.muted"
          />
        </div>
        <el-divider />
        <div class="info-item-button-group">
          <el-button
            class="button"
            type="primary"
            :disabled="groupInfo.status == GroupStatus.DISBAND"
            @click="handleUpdateUserGroupInfo"
            >保存修改</el-button
          >
          <el-button class="button" type="primary" @click="handleSendMessage"
            >发送消息</el-button
          >
          <el-button class="button" type="primary" @click="handleManageGroup"
            >群聊管理</el-button
          >
          <el-button class="button" type="danger" @click="handleQuitGroup"
            >退出群聊</el-button
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ChatType } from '@/api/chat/types';
import { quitGroup, updateUserGroupInfo } from '@/api/group';
import { GroupStatus, type UserGroupVo } from '@/api/group/types';
import { useChatStore } from '@/stores/chat';
import { useGroupStore } from '@/stores/group';
import { useUserStore } from '@/stores/user';
import { getFileUrl } from '@/utils/file';
import { SettingType } from '@/views/Setting/components/types';

const dialogVisible = defineModel({ type: Boolean, default: false });
const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits<{
  onGroupInfoUpdate: [UserGroupVo];
}>();
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
  const userGroupVo = groupStore.getUserGroupVoById(props.groupId);
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
      groupStore.getUserGroupVoById(props.groupId)?.groupRemark &&
    groupInfo.value.muted ===
      groupStore.getUserGroupVoById(props.groupId)?.muted
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
    groupStore.loadGroupList(true);
    emit('onGroupInfoUpdate', groupInfo.value);
    chatStore.updateGroupConversation(groupInfo.value);
  }
  dialogVisible.value = false;
};
const handleSendMessage = () => {
  chatStore.chatId = props.groupId;
  chatStore.isChatting = true;
  chatStore.chatType = ChatType.GROUP;
  router.push({ name: 'Chat' });
  dialogVisible.value = false;
};
const handleQuitGroup = () => {
  ElMessageBox.confirm('确定退出该群组吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await quitGroup(userStore.userInfo.id, props.groupId);
      ElMessage.success('操作成功');
      dialogVisible.value = false;
      groupStore.loadGroupList(true);
      chatStore.deleteConversation(props.groupId, ChatType.GROUP);
    })
    .catch(() => {});
};
const handleManageGroup = () => {
  router.push({
    name: 'Setting',
    params: { settingType: SettingType.GROUP },
    query: { id: props.groupId },
  });
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
    .icon-add-a-photo {
      border-radius: 3px;
      padding: 2px;
      fill: white;
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      left: 50%;
      top: 130px;
      transform: translateX(35px);
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.6);
      }
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
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 10px;
        .button {
          flex: 1;
        }
      }
    }
  }
}
</style>
