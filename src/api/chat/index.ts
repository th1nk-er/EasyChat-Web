import { StompClient } from "@/utils/ws";
import type { ChatMessage } from "./types";
import { SHA256 } from "crypto-js";

export const subscribeMessage = (
  client: StompClient,
  token: string | undefined,
  callback: (message: ChatMessage) => void
) => {
  if (!client.connected) return;
  client.subscribe(
    "/notify/message/" + SHA256(token ? token : "").toString(),
    (message) => {
      callback(JSON.parse(message.body));
    }
  );
};
export const sendMessage = (
  client: StompClient,
  token: string | undefined,
  message: ChatMessage
) => {
  if (!client.connected) return;
  client.publish({
    destination: "/notify/send/" + SHA256(token ? token : ""),
    body: JSON.stringify(message),
  });
};

export const sendConnect = (client: StompClient) => {
  if (!client.connected) return;
  client.publish({
    destination: "/notify/connect",
    body: "",
  });
};
