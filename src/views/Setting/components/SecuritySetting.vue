<template>
  <div class="setting">
    <div class="setting-item">
      <span class="setting-item-label">账号设置</span>
      <!-- TODO -->
    </div>
    <div class="setting-item">
      <span class="setting-item-label">登录设置</span>
      <div class="setting-item-container">
        <el-table :data="tokenVoList">
          <el-table-column type="index" width="50" />
          <el-table-column prop="loginIp" label="登录IP" width="180" />
          <el-table-column prop="userAgent" label="登录设备UA" width="180" />
          <el-table-column prop="issueTime" label="登录时间" />
          <el-table-column prop="expireTime" label="令牌失效时间" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag
                v-if="new Date(scope.row.expireTime) > new Date()"
                type="success"
                >有效</el-tag
              >
              <el-tag v-else type="danger">失效</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getUserTokenVoList } from '@/api/serucity';
import type { UserTokenVo } from '@/api/serucity/types';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const tokenVoList = ref([] as UserTokenVo[]);
onMounted(() => {
  loadTokenVo();
});

const loadTokenVo = async () => {
  const resp = await getUserTokenVoList(userStore.userInfo.id);
  tokenVoList.value = resp.data;
  tokenVoList.value.map((item) => {
    item.issueTime = new Date(item.issueTime).toLocaleString();
    item.expireTime = new Date(item.expireTime).toLocaleString();
  });
};
</script>
<style scoped lang="scss">
@import './style.scss';
</style>
