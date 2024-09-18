import { getGroupList } from '@/api/group';
import type { UserGroupVo } from '@/api/group/types';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useGroupStore = defineStore('group', {
  state() {
    return {
      groupList: [] as UserGroupVo[],
    };
  },
  getters: {},
  actions: {
    getUserVoById(groupId: number) {
      return this.groupList.find((item) => item.groupId == groupId);
    },
    loadGroupList() {
      let groupList: UserGroupVo[] = [];
      let page = 1;
      const intervalId = setInterval(async () => {
        const userStore = useUserStore();
        try {
          const resp = await getGroupList(userStore.userInfo.id, page++);
          if (resp.data.length == 0) {
            clearInterval(intervalId);
          } else {
            groupList.push(...resp.data);
          }
        } catch (e) {
          clearInterval(intervalId);
        }
      }, 300);
      this.groupList = groupList;
    },
  },
});
