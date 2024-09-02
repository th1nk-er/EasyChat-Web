<template>
  <el-dialog v-model="dialogShow" width="35%">
    <div class="container">
      <div class="avatar">
        <img :src="getFileUrl(userStore.userInfo.avatar)" class="img-avatar" />
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
          <span class="info-item__content" v-show="!editNicknameShow">{{
            userNickname
          }}</span>
          <IconEdit
            class="icon-edit"
            v-show="!editNicknameShow"
            @click="
              editNicknameShow = true;
              nicknameInputRef?.focus();
            "
          />
          <el-input
            ref="nicknameInputRef"
            v-model="userNickname"
            v-show="editNicknameShow"
            style="width: 30%"
            @blur="editNicknameShow = false"
          />
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
          <el-select v-model="selectedSex" style="width: 180px">
            <el-option
              :label="getSexString(UserSex.SECRET)"
              :value="UserSex.SECRET"
            />
            <el-option
              :label="getSexString(UserSex.MALE)"
              :value="UserSex.MALE"
            />
            <el-option
              :label="getSexString(UserSex.FEMALE)"
              :value="UserSex.FEMALE"
            />
          </el-select>
        </div>
        <div class="info-item">
          <span class="info-item__label">注册时间</span>
          <span class="info-item__content">{{
            new Date(userStore.userInfo.createTime).toLocaleString()
          }}</span>
        </div>
        <el-divider />
        <div class="info-item-button-group">
          <el-button type="primary" class="button" @click="handleUpdateUserInfo"
            >保存信息</el-button
          >
          <el-button class="button" @click="changePasswordDialogShow = true"
            >修改密码</el-button
          >
          <el-button class="button">修改邮箱</el-button>
          <ChangePasswordDialog v-model="changePasswordDialogShow" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { changeAvatar, getUserInfo, updateUserInfo } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { getSexString } from "@/utils/userUtils";
import { getFileUrl } from "@/utils/file";
import ChangePasswordDialog from "./ChangePasswordDialog.vue";
import { UserSex } from "@/api/user/types";

const userStore = useUserStore();
const dialogShow = defineModel({
  type: Boolean,
  default: false,
});

const changePasswordDialogShow = ref(false);
const avatarUploader = ref<HTMLInputElement>();
const handleAvatarUpload = async () => {
  const file = avatarUploader.value?.files?.[0];
  if (file == undefined) return;
  if (file.size > 1024 * 1024 * 5) {
    ElMessage.error("头像图片过大,请更换其他图片");
    return;
  }
  const resp = await changeAvatar(file);
  userStore.userInfo.avatar = resp.data;
  ElMessage.success("头像上传成功");
};

const selectedSex = ref<UserSex>(UserSex.SECRET);
const userNickname = ref("");
const nicknameInputRef = ref<HTMLInputElement>();
const editNicknameShow = ref(false);
const handleUpdateUserInfo = async () => {
  if (userNickname.value.length < 3 || userNickname.value.length > 20) {
    ElMessage.error("昵称长度在3-20个字符之间");
    return;
  }
  if (
    userNickname.value == userStore.userInfo.nickname &&
    selectedSex.value == userStore.userInfo.sex
  ) {
    ElMessage.success("修改成功");
  } else {
    // 发送请求修改
    await updateUserInfo({
      nickname: userNickname.value,
      sex: selectedSex.value,
    });
    ElMessage.success("修改成功");
    dialogShow.value = false;
    // 获取新数据
    userStore.userInfo = (await getUserInfo()).data;
  }
};
const loadData = () => {
  selectedSex.value = userStore.userInfo.sex;
  userNickname.value = userStore.userInfo.nickname;
};
watch(dialogShow, (value) => {
  if (value) {
    loadData();
  }
});
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
