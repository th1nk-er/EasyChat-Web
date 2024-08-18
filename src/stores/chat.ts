import type { UserConversation, WSMessage } from "@/api/chat/types";
import type { UserFriendVo } from "@/api/friend/type";
import { defineStore } from "pinia";
export const useChatStore = defineStore("chat", {
  state() {
    return {
      /** 当前聊天的用户ID */
      chatId: undefined as number | undefined,
      isChatting: false,
      chatType: "friend" as "friend" | "group",
      conversationList: [] as UserConversation[],
    };
  },
  getters: {
    unread: (state) => {
      let res = 0;
      for (let i = 0; i < state.conversationList.length; i++) {
        if (state.conversationList[i].unreadCount > 0) {
          if (state.conversationList[i].muted) res++;
          else res += state.conversationList[i].unreadCount;
        }
      }
      return res;
    },
  },
  actions: {
    /**
     * 清除指定好友对话的未读消息
     * @param friendId 好友ID
     */
    clearFriendUnread(friendId: number) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (friendId != undefined && list[i].friendId === friendId) {
          this.conversationList[i].unreadCount = 0;
          break;
        }
      }
    },
    updateConversation(message: WSMessage) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (message.toId != undefined && list[i].friendId === message.toId) {
          // 用户发送的消息
          this.conversationList[i].lastMessage = message.content;
          this.conversationList[i].messageType = message.type;
          this.conversationList[i].updateTime = new Date().toISOString();
          this.conversationList[i].unreadCount = 0;
          // 置顶消息
          [this.conversationList[0], this.conversationList[i]] = [
            this.conversationList[i],
            this.conversationList[0],
          ];
          break;
        } else if (
          message.fromId != undefined &&
          list[i].friendId === message.fromId
        ) {
          // 用户接收的消息
          this.conversationList[i].lastMessage = message.content;
          this.conversationList[i].messageType = message.type;
          this.conversationList[i].updateTime = new Date().toISOString();
          this.conversationList[i].unreadCount++;
        }
      }
    },
    updateFriendConversation(friendInfo: UserFriendVo) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (
          friendInfo.friendId != undefined &&
          list[i].friendId === friendInfo.friendId
        ) {
          this.conversationList[i].remark = friendInfo.remark;
          this.conversationList[i].muted = friendInfo.muted;
          return;
        }
      }
    },
  },
  persist: {
    paths: ["conversationList"],
  },
});
