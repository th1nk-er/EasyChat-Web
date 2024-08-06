import { stompClient } from "@/utils/ws";
import request from "@/utils/service";
import type { ChatMessage, UserConversation, WSMessage } from "./types";
import { SHA256 } from "crypto-js";
import { useUserStore } from "@/stores/user";
import type { Result } from "../types";
const userStore = useUserStore();

/**
 * 订阅消息
 */
export const subscribeMessage = (callback: (message: WSMessage) => void) => {
  const userToken = userStore.getUserToken?.token;
  if (userToken == undefined) {
    return false;
  }
  if (!stompClient.connected) return;
  stompClient.subscribe(
    "/notify/message/" + SHA256(userToken).toString(),
    (message) => {
      callback(JSON.parse(message.body));
    }
  );
  return true;
};
/**
 * 发送消息
 */
export const sendMessage = (message: WSMessage) => {
  const userToken = userStore.getUserToken?.token;
  if (userToken == undefined) {
    return false;
  }
  if (!stompClient.connected) return;
  stompClient.publish({
    destination: "/message/chat.send",
    body: JSON.stringify(message),
  });
  return true;
};

/**
 * 发送连接消息
 */
export const sendConnect = () => {
  if (!stompClient.connected) return;
  stompClient.publish({
    destination: "/notify/connect",
    body: "",
  });
};

/**
 * 获取消息历史记录
 * @param userId 对方用户ID
 * @param currentPage 页码
 * @returns
 */
export const getMessageHistory = (userId: number, currentPage: number) => {
  return request.get<Result<ChatMessage[]>>({
    url: `/message/history/${userId}/${currentPage}`,
    method: "get",
  });
};

/**
 * 获取用户对话列表
 */
export const getUserConversationList = (pageNum: number) => {
  return request.get<Result<UserConversation[]>>({
    url: `/conversation/list/${pageNum}`,
    method: "get",
  });
};
