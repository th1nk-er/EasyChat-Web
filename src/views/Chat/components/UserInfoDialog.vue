<template>
  <el-dialog v-model="dialogShow" width="35%">
    <div class="container">
      <div class="avatar">
        <img
          :src="getAvatarUrl(userStore.userInfo.avatar)"
          class="img-avatar"
        />
        <IconAddAPhoto
          class="icon-add-a-photo"
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
      <el-divider />
      <div class="info-container">
        <div class="info-item">
          <span class="info-item__label">用&nbsp;&nbsp;户&nbsp;&nbsp;名</span>
          <span class="info-item__content">{{
            userStore.userInfo.username
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</span
          >
          <span class="info-item__content">{{
            userStore.userInfo.nickname
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱</span
          >
          <span class="info-item__content">{{ userStore.userInfo.email }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label"
            >性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span
          >
          <span class="info-item__content">{{
            getSexString(userStore.userInfo.sex)
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label">注册时间</span>
          <span class="info-item__content">{{
            new Date(userStore.userInfo.createTime).toLocaleString()
          }}</span>
        </div>
        <el-divider />
        <div class="info-item-button-group">
          <el-button type="primary" class="button">编辑资料</el-button>
          <el-button class="button">修改密码</el-button>
          <el-button class="button">修改邮箱</el-button>
        </div>
      </div>
    </div></el-dialog
  >
</template>
<script setup lang="ts">
import { changeAvatar } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { getAvatarUrl, getSexString } from "@/utils/userUtils";

const userStore = useUserStore();
const dialogShow = defineModel("dialogShow", {
  type: Boolean,
  default: false,
});

const avatarUploader = ref<HTMLInputElement>();
const handleAvatarUpload = async () => {
  const file = avatarUploader.value?.files?.[0];
  if (file == undefined) return;
  const resp = await changeAvatar(file);
  userStore.userInfo.avatar = resp.data;
  ElMessage.success("头像上传成功");
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
