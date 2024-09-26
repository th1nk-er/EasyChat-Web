import { getGroupList, getGroupmemberInfo } from '@/api/group';
import type { GroupMemberInfoVo, UserGroupVo } from '@/api/group/types';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useGroupStore = defineStore('group', {
  state() {
    return {
      groupList: [] as UserGroupVo[],
      groupMemberList: [] as GroupMemberInfoVo[],
      loaded: false,
    };
  },
  getters: {},
  actions: {
    getUserGroupVoById(groupId: number) {
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
            this.groupList = groupList;
            clearInterval(intervalId);
            this.loaded = true;
          } else {
            groupList.push(...resp.data);
          }
        } catch (e) {
          this.groupList = groupList;
          clearInterval(intervalId);
          this.loaded = true;
        }
      }, 300);
    },
    /**
     * 获取群组成员信息并存储，如果已经存储则直接返回
     * @param groupId 群组ID
     * @param userId 用户ID
     * @returns `GroupMemberInfoVo`
     */
    async getMemberInfo(groupId: number, userId: number) {
      let result = this.groupMemberList.find(
        (item) => item.groupId == groupId && item.userId == userId
      );
      if (result) {
        return result;
      } else {
        const resp = await getGroupmemberInfo(groupId, userId);
        if (resp.data != null) {
          result = resp.data;
          this.groupMemberList.push(result);
          return result;
        } else return undefined;
      }
    },
  },
});
