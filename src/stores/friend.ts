import type { UserFriendVo } from "@/api/friend/type";
import { defineStore } from "pinia";
export const useFriendStore = defineStore("friend", {
  state() {
    return {
      friendList: [] as UserFriendVo[],
    };
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
  },
});
