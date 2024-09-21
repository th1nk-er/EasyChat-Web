import { getUserConversationList } from '@/api/chat';
import {
  ChatType,
  MessageType,
  type UserConversation,
  type WSMessage,
} from '@/api/chat/types';
import type { UserFriendVo } from '@/api/friend/types';
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import type { UserGroupVo } from '@/api/group/types';
export const useChatStore = defineStore('chat', {
  state() {
    return {
      /** 当前聊天的用户ID */
      chatId: -1,
      isChatting: false,
      chatType: ChatType.FRIEND,
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
    getConversation: (state) => (chatId: number, chatType: ChatType) => {
      for (let i = 0; i < state.conversationList.length; i++) {
        if (
          state.conversationList[i].chatId === chatId &&
          state.conversationList[i].chatType === chatType
        ) {
          return state.conversationList[i];
        }
      }
    },
  },
  actions: {
    async loadConversations() {
      const userStore = useUserStore();
      const resp = await getUserConversationList(userStore.userInfo.id);
      if (resp.data.length > 0) {
        this.conversationList = resp.data;
      }
    },
    /**
     * 清除指定话的未读消息
     * @param chatId 对方ID
     */
    clearConversationUnread(chatId: number, chatType: ChatType) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (
          list[i].chatType == chatType &&
          chatId != undefined &&
          list[i].chatId === chatId
        ) {
          this.conversationList[i].unreadCount = 0;
          break;
        }
      }
    },
    /**
     * 根据消息更新对话列表
     * 若存在则更新，不存在则添加
     * @param message 消息
     */
    updateConversation(message: WSMessage) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (message.toId != undefined && list[i].chatId === message.toId) {
          // 用户发送的消息
          this.conversationList[i].lastMessage = message.content;
          this.conversationList[i].messageType = message.messageType;
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
          list[i].chatId === message.fromId
        ) {
          // 用户接收的消息
          this.conversationList[i].lastMessage = message.content;
          this.conversationList[i].messageType = message.messageType;
          this.conversationList[i].updateTime = new Date().toISOString();
          this.conversationList[i].unreadCount++;
          // 置顶消息
          [this.conversationList[0], this.conversationList[i]] = [
            this.conversationList[i],
            this.conversationList[0],
          ];
        }
      }
    },
    /**
     * 当好友信息更新时，调用该方法更新对话列表
     * @param friendInfo 好友信息
     * @returns
     */
    updateFriendConversation(friendInfo: UserFriendVo) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (
          list[i].chatType == ChatType.FRIEND &&
          friendInfo.friendId != undefined &&
          list[i].chatId === friendInfo.friendId
        ) {
          this.conversationList[i].remark = friendInfo.remark;
          this.conversationList[i].muted = friendInfo.muted;
          return;
        }
      }
      this.conversationList.unshift({
        id: 0,
        uid: 0,
        chatId: friendInfo.friendId,
        avatar: friendInfo.avatar,
        nickname: friendInfo.nickname,
        remark: friendInfo.remark,
        muted: friendInfo.muted,
        unreadCount: 0,
        lastMessage: '',
        messageType: MessageType.TEXT,
        updateTime: new Date() + '',
        chatType: ChatType.FRIEND,
      });
    },
    /**
     * 当群组信息更新时，调用该方法更新对话列表
     * @param groupInfo 群组信息
     */
    updateGroupConversation(groupInfo: UserGroupVo) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (
          list[i].chatType == ChatType.GROUP &&
          groupInfo.groupId != undefined &&
          list[i].chatId === groupInfo.groupId
        ) {
          this.conversationList[i].remark = groupInfo.groupRemark ?? '';
          this.conversationList[i].avatar = groupInfo.avatar;
          return;
        }
      }
      this.conversationList.unshift({
        id: 0,
        uid: 0,
        chatId: groupInfo.groupId,
        avatar: groupInfo.avatar,
        nickname: groupInfo.groupName,
        remark: groupInfo.groupRemark ?? '',
        muted: groupInfo.muted,
        unreadCount: 0,
        lastMessage: '',
        messageType: MessageType.TEXT,
        updateTime: new Date() + '',
        chatType: ChatType.GROUP,
      });
    },
    /**
     * 删除指定对话
     * @param chatId 发送者ID
     * @param chatType 对话类型
     */
    deleteConversation(chatId: number, chatType: ChatType) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (
          list[i].chatType == chatType &&
          chatId != undefined &&
          list[i].chatId === chatId
        ) {
          this.conversationList.splice(i, 1);
          break;
        }
      }
    },
  },
  persist: {
    paths: ['conversationList'],
  },
});
