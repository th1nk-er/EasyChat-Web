import { useUserStore } from '@/stores/user';
import { useWSStore } from '@/stores/ws';
import request from '@/utils/service';
import { SHA256 } from 'crypto-js';
import type { Result } from '../types';
import {
  ChatType,
  type ChatMessage,
  type UserConversation,
  type WSMessage,
} from './types';

/**
 * 订阅消息
 */
export const subscribeMessage = (callback: (message: WSMessage) => void) => {
  const stompClient = useWSStore().stompClient;
  const userToken = useUserStore().getUserToken?.token;
  if (userToken == undefined) {
    return;
  }
  if (!stompClient.connected) return;
  return stompClient.subscribe(
    '/notify/message/' + SHA256(userToken).toString(),
    (message) => {
      callback(JSON.parse(message.body));
    }
  );
};
/**
 * 订阅群聊消息
 * @param groupId 群聊ID
 * @param callback 回调函数
 */
export const subscribeGroupMessage = (
  groupId: number,
  callback: (message: WSMessage) => void
) => {
  const stompClient = useWSStore().stompClient;
  if (!stompClient.connected) return;
  return stompClient.subscribe(
    '/notify/message/group/' + groupId,
    (message) => {
      callback(JSON.parse(message.body));
    }
  );
};
/**
 * 发送消息
 */
export const sendMessage = (message: WSMessage) => {
  const stompClient = useWSStore().stompClient;
  const userToken = useUserStore().getUserToken?.token;
  if (userToken == undefined) {
    return false;
  }
  if (!stompClient.connected) return false;
  stompClient.publish({
    destination: '/message/chat.send',
    body: JSON.stringify(message),
  });
  return true;
};

/**
 * 发送连接消息
 */
export const sendConnect = () => {
  const stompClient = useWSStore().stompClient;
  if (!stompClient.connected) return;
  stompClient.publish({
    destination: '/notify/connect',
    body: '',
  });
};
/**
 * 当打开某个对话时向服务器发送信息
 */
export const publishOpenConversation = (toId: number, chatType: ChatType) => {
  const stompClient = useWSStore().stompClient;
  if (!stompClient.connected) return;
  stompClient.publish({
    destination: '/conversation/open',
    body: JSON.stringify({ toId: toId, chatType: chatType } as WSMessage),
  });
};
/**
 * 获取消息历史记录
 * @param userId 用户ID
 * @param receiverId 对方用户ID
 * @param currentPage 页码
 * @returns
 */
export const getMessageHistory = (
  userId: number,
  receiverId: number,
  currentPage: number
) => {
  return request.get<Result<ChatMessage[]>>({
    url: `/message/history/${userId}/${receiverId}/${currentPage}`,
    method: 'get',
  });
};

/**
 * 获取群聊消息历史记录
 * @param groupId 群聊ID
 * @param currentPage 页码
 * @returns
 */
export const getGroupMessageHistory = (
  groupId: number,
  currentPage: number
) => {
  return request.get<Result<ChatMessage[]>>({
    url: `/message/history/group/${groupId}/${currentPage}`,
    method: 'get',
  });
};
/**
 * 获取用户对话列表
 * @param userId 用户ID
 */
export const getUserConversationList = (userId: number) => {
  return request.get<Result<UserConversation[]>>({
    url: `/conversation/list/${userId}`,
    method: 'get',
  });
};

/**
 * 上传聊天图片
 * @param file 图片文件
 */
export const uploadChatImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<Result<string>>({
    url: '/upload/chat/image',
    method: 'post',
    data: formData,
  });
};
