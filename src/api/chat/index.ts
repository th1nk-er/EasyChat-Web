import { stompClient } from "@/utils/ws";
import type { ChatMessage } from "./types";
import { SHA256 } from "crypto-js";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

/**
 * 订阅消息
 */
export const subscribeMessage = (callback: (message: ChatMessage) => void) => {
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
export const sendMessage = (message: ChatMessage) => {
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
