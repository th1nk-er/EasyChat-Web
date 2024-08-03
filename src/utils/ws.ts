import { useUserStore } from "@/stores/user";
import {
  Client,
  StompHeaders,
  type IPublishParams,
  type messageCallbackType,
  type StompSubscription,
} from "@stomp/stompjs";
import SockJs from "sockjs-client/dist/sockjs.min.js";
const userStore = useUserStore();
const tokenString = userStore.getUserToken ? userStore.getUserToken.token : "";
class StompClient extends Client {
  PUB_PREFIX: string = "/app";
  connectHeaders: StompHeaders = {
    Authentication: tokenString,
  };
  webSocketFactory = () => new SockJs(import.meta.env.VITE_WEBSOCKET_ENDPOINT);
  subscribe(
    destination: string,
    callback: messageCallbackType,
    headers?: StompHeaders
  ): StompSubscription {
    return super.subscribe(destination, callback, headers);
  }

  publish(params: IPublishParams): void {
    return super.publish({
      destination: this.PUB_PREFIX + params.destination,
      body: params.body,
      headers: params.headers,
    });
  }
}

export const stompClient = new StompClient();
