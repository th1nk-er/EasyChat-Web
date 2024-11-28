<template>
  <div class="setting">
    <div class="setting-item">
      <span class="setting-item-label">账号设置</span>
      <el-button type="primary" @click="changePasswordDialogShow = true"
        >修改密码</el-button
      >
      <ChangePasswordDialog v-model="changePasswordDialogShow" />
      <el-button type="primary">修改邮箱</el-button>
    </div>
    <div class="setting-item">
      <span class="setting-item-label">登录设置</span>
      <div class="setting-item-container">
        <el-table :data="tokenVoList">
          <el-table-column type="index" width="50" />
          <el-table-column prop="loginIp" label="登录IP" />
          <el-table-column label="登录地点" width="150">
            <template #default="scope">
              {{ getIpLocationText(scope.row.loginIp) }}
            </template>
          </el-table-column>
          <el-table-column prop="userAgent" label="登录设备UA" width="180" />
          <el-table-column prop="issueTime" label="登录时间" />
          <el-table-column prop="expireTime" label="令牌失效时间" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag
                v-if="userStore.userToken.id == scope.row.id"
                type="success"
                >当前设备</el-tag
              >
              <el-tag
                v-if="new Date(scope.row.expireTime) > new Date()"
                type="success"
                >有效</el-tag
              >
              <el-tag v-else type="danger">失效</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="danger"
                link
                v-if="
                  userStore.userToken.id != scope.row.id &&
                  new Date(scope.row.expireTime) > new Date()
                "
                @click="handleExpireToken(scope.row.id)"
                >下线</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getIpDetails } from '@/api/external';
import type { IPDetails } from '@/api/external/types';
import { expireUserToken, getUserTokenVoList } from '@/api/serucity';
import type { UserTokenVo } from '@/api/serucity/types';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const tokenVoList = ref([] as UserTokenVo[]);
onMounted(() => {
  loadTokenVo();
});
const changePasswordDialogShow = ref(false);
const loadTokenVo = async () => {
  const resp = await getUserTokenVoList(userStore.userInfo.id);
  tokenVoList.value = resp.data;
  tokenVoList.value.map((item) => {
    item.issueTime = new Date(item.issueTime).toLocaleString();
    item.expireTime = new Date(item.expireTime).toLocaleString();
  });
};
const handleExpireToken = async (tokenId: number) => {
  await ElMessageBox.confirm('确定下线该设备？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await expireUserToken(userStore.userInfo.id, tokenId);
  tokenVoList.value.filter((item) => item.id == tokenId)[0].expireTime =
    new Date().toLocaleString();
  ElMessage.success('下线成功');
};
const ipDetails = ref([] as IPDetails[]);
const loadIpDetails = async (ip: string) => {
  if (!ip) return;
  ipDetails.value.push({
    query: ip,
    country: '',
    regionName: '',
    city: '',
    org: '',
  } as IPDetails);
  try {
    const resp = await getIpDetails(ip);
    ipDetails.value = ipDetails.value.map((item) => {
      if (item.query == ip) {
        item.status = resp.status;
        item.message = resp.message;
        item.country = resp.country;
        item.regionName = resp.regionName;
        item.org = resp.org;
        item.city = resp.city;
      }
      return item;
    });
  } catch (_) {
    ipDetails.value = ipDetails.value.map((item) => {
      if (item.query == ip) {
        item.status = 'fail';
        item.message = '获取失败';
      }
      return item;
    });
  }
};

const getIpLocationText = (ip: string) => {
  if (!ip) return;
  const ipDetail = ipDetails.value.find((item) => item.query == ip);
  if (ipDetail) {
    if (ipDetail.status == 'fail') {
      return ipDetail.message;
    }
    return `${ipDetail.country} ${ipDetail.regionName} ${ipDetail.city} ${ipDetail.org}`;
  } else {
    loadIpDetails(ip);
  }
  return '';
};
</script>
<style scoped lang="scss">
@import './style.scss';
</style>
