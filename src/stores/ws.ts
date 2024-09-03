import { StompClient } from "@/utils/ws";
import { defineStore } from "pinia";

export const useWSStore = defineStore("ws", {
  state: () => ({
    // websocket连接对象
    stompClient: new StompClient(),
  }),
});
