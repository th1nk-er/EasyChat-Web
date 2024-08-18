<template>
  <el-dialog v-model="dialogShow" width="35%">
    <div class="container">
      <div class="avatar">
        <img :src="getAvatarUrl(friendInfo.avatar)" class="img-avatar" />
      </div>
      <el-divider />
      <div class="info-container">
        <div class="info-item">
          <span class="info-item__label">用&nbsp;&nbsp;户&nbsp;&nbsp;名</span>
          <span class="info-item__content">{{ friendInfo.username }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</span
          >
          <span class="info-item__content">{{ friendInfo.nickname }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span
          >
          <span class="info-item__content" v-show="!editRemarkShow">{{
            friendInfo.remark
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
            v-model="friendInfo.remark"
            maxlength="20"
            v-show="editRemarkShow"
            ref="remarkInputRef"
            @blur="editRemarkShow = false"
            style="width: 30%"
          />
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span
          >
          <span class="info-item__content">{{
            getSexString(friendInfo.sex)
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label">添加时间</span>
          <span class="info-item__content">{{
            new Date(friendInfo.createTime).toLocaleString()
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >免&nbsp;&nbsp;打&nbsp;&nbsp;&nbsp;扰</span
          >
          <el-switch v-model="friendInfo.muted" />
        </div>
        <el-divider />
        <div class="info-item-button-group">
          <el-button
            class="button"
            type="primary"
            @click="handleUpdateFriendInfo"
            >保存修改</el-button
          >
          <el-button class="button" type="primary" @click="handleSendMessage"
            >发送消息</el-button
          >
          <el-button class="button" type="danger">删除好友</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { updateFriendInfo } from "@/api/friend";
import type { UserFriendVo } from "@/api/friend/type";
import { useChatStore } from "@/stores/chat";
import { useFriendStore } from "@/stores/friend";
import { getAvatarUrl, getSexString } from "@/utils/userUtils";
const router = useRouter();
const chatStore = useChatStore();
const friendStore = useFriendStore();
const dialogShow = defineModel({ type: Boolean, default: false });
const props = defineProps({
  friendInfo: { type: Object as PropType<UserFriendVo>, required: true },
});
const emit = defineEmits(["onFriendInfoUpdate"]);
const friendInfo = ref<UserFriendVo>({ ...props.friendInfo });
watch(dialogShow, (value) => {
  if (value) {
    friendInfo.value = { ...props.friendInfo };
  }
});
const editRemarkShow = ref(false);
const remarkInputRef = ref<HTMLInputElement>();
const handleUpdateFriendInfo = async () => {
  await updateFriendInfo(friendInfo.value);
  emit("onFriendInfoUpdate", friendInfo.value);
  // 更新对话列表的信息
  chatStore.updateFriendConversation(friendInfo.value);
  // 更新好友列表的信息
  friendStore.updateFriendVo(friendInfo.value);
  ElMessage.success("修改成功");
  dialogShow.value = false;
};
const handleSendMessage = () => {
  chatStore.chatId = friendInfo.value.friendId;
  chatStore.chatType = "friend";
  chatStore.isChatting = true;
  router.push({ name: "ChatList" });
  dialogShow.value = false;
};
</script>
<style lang="scss" scoped>
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
        width: 30%;
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
