import { getGroupIgnored, getGroupList, getGroupmemberInfo } from '@/api/group';
import type {
  GroupMemberIgnoredVo,
  GroupMemberInfoVo,
  UserGroupVo,
} from '@/api/group/types';
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { UserRole } from '@/api/user/types';

export const useGroupStore = defineStore('group', {
  state() {
    return {
      groupList: [] as UserGroupVo[],
      groupMemberList: [] as GroupMemberInfoVo[],
      ignoredMemberList: [] as {
        groupId: number;
        ignoredList: GroupMemberIgnoredVo[];
      }[],
      loaded: false,
    };
  },
  getters: {
    isMemberAdmin: (state) => (groupId: number, userId: number) => {
      const member = state.groupMemberList.find(
        (item) => item.groupId == groupId && item.userId == userId
      );
      if (member)
        return member.role == UserRole.ADMIN || member.role == UserRole.LEADER;
      else return false;
    },
    getIgnoredList: (state) => (groupId: number) => {
      const r = state.ignoredMemberList.find(
        (item) => item.groupId === groupId
      );
      if (r) return r.ignoredList;
      return [];
    },
  },
  actions: {
    getUserGroupVoById(groupId: number) {
      return this.groupList.find((item) => item.groupId == groupId);
    },
    loadGroupList() {
      if (this.loaded) return;
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
    /**
     * 加载指定群组的屏蔽列表
     * @param groupId 群组ID
     */
    async loadIgnoredMembers(groupId: number) {
      if (this.ignoredMemberList.find((item) => item.groupId === groupId))
        return;
      const userStore = useUserStore();
      const resp = await getGroupIgnored(userStore.userInfo.id, groupId);
      this.ignoredMemberList.push({ groupId, ignoredList: resp.data });
    },
    /**
     * 取消屏蔽指定群组成员
     * @param groupId 群组ID
     * @param memberId 成员ID
     */
    cancelIgnoreMember(groupId: number, memberId: number) {
      const list = this.ignoredMemberList.find(
        (item) => item.groupId === groupId
      );
      if (list) {
        const index = list.ignoredList.findIndex(
          (item) => item.ignoredId === memberId
        );
        if (index != -1) list.ignoredList.splice(index, 1);
      }
    },
  },
  persist: {
    paths: ['groupList'],
  },
});
