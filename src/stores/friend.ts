import type { UserFriendVo } from '@/api/friend/types';
import { defineStore } from 'pinia';
export const useFriendStore = defineStore('friend', {
  state() {
    return {
      friendList: [] as UserFriendVo[],
    };
  },
  getters: {
    getFriendVoById: (state) => (friendId: number) => {
      return state.friendList.find((item) => item.friendId == friendId);
    },
  },
  actions: {
    /**
     * 更新其中一个好友的信息
     */
    updateFriendVo(friendVo: UserFriendVo) {
      const index = this.friendList.findIndex(
        (item) => item.friendId === friendVo.friendId
      );
      if (index !== -1) {
        this.friendList[index] = friendVo;
      }
    },
    deleteFriendVo(friendId: number) {
      const list = this.friendList;
      for (let i = 0; i < list.length; i++) {
        if (friendId != undefined && list[i].friendId === friendId) {
          this.friendList.splice(i, 1);
          break;
        }
      }
    },
  },
});
