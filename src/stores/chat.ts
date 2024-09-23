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
import { useFriendStore } from './friend';
import { useGroupStore } from './group';
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
     * 将指定对话移动到顶部
     * @param chatId 对方ID
     * @param chatType 对话类型
     */
    moveToTop(chatId: number, chatType: ChatType) {
      const list = this.conversationList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].chatType == chatType && list[i].chatId === chatId) {
          [this.conversationList[0], this.conversationList[i]] = [
            this.conversationList[i],
            this.conversationList[0],
          ];
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
      let senderId: number | undefined;
      let chatId: number | undefined;
      if (message.chatType == ChatType.FRIEND) {
        chatId = message.fromId;
        senderId = message.fromId;
      } else if (message.chatType == ChatType.GROUP) {
        chatId = message.toId;
        senderId = message.fromId;
      }
      const userStore = useUserStore();
      let conversation: UserConversation | undefined;
      if (chatId == undefined) return;
      conversation = this.getConversation(chatId, message.chatType);
      if (conversation) {
        conversation.lastMessage = message.content;
        conversation.messageType = message.messageType;
        conversation.updateTime = new Date().toISOString();
        if (senderId == userStore.userInfo.id)
          conversation.unreadCount = 0; // 用户发送的消息
        else if (
          this.chatType != this.chatType ||
          this.chatId != chatId ||
          !this.isChatting
        )
          conversation.unreadCount++; // 用户收到的消息
        this.moveToTop(chatId, message.chatType);
      } else this.addConversation(chatId, message.chatType, message);
    },
    /**
     * 添加对话
     * message可选，若不传入则仅添加对话
     * @param chatId 对方ID
     * @param chatType 对话类型
     * @param message 消息
     */
    addConversation(chatId: number, chatType: ChatType, message?: WSMessage) {
      if (this.getConversation(chatId, chatType) != undefined) return;
      let conversation = {} as UserConversation;
      const userStore = useUserStore();
      conversation.uid = userStore.userInfo.id;
      conversation.chatType = chatType;
      conversation.chatId = chatId;
      conversation.lastMessage = message?.content ?? '';
      conversation.messageType = message?.messageType ?? MessageType.TEXT;
      conversation.unreadCount = message ? 1 : 0;
      conversation.updateTime = new Date().toISOString();
      if (chatType == ChatType.FRIEND) {
        const friendStore = useFriendStore();
        const friendVo = friendStore.getFriendVoById(chatId);
        if (friendVo == undefined) return;
        conversation.avatar = friendVo.avatar;
        conversation.nickname = friendVo.nickname;
        conversation.remark = friendVo.remark;
        conversation.muted = friendVo.muted;
      } else if (chatType == ChatType.GROUP) {
        const groupStore = useGroupStore();
        const groupVo = groupStore.getUserGroupVoById(chatId);
        if (groupVo == undefined) return;
        conversation.avatar = groupVo.avatar;
        conversation.nickname = groupVo.groupName;
        conversation.remark = groupVo.groupRemark ?? '';
        conversation.muted = groupVo.muted;
      }
      this.conversationList.unshift(conversation);
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
        }
      }
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
        }
      }
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
