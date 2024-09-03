import { useUserStore } from "@/stores/user";
import {
  Client,
  StompHeaders,
  type IPublishParams,
  type messageCallbackType,
  type StompSubscription,
} from "@stomp/stompjs";
import SockJs from "sockjs-client/dist/sockjs.min.js";
export class StompClient extends Client {
  private getTokenString() {
    const userStore = useUserStore();
    return userStore.getUserToken ? userStore.getUserToken.token : "";
  }
  PUB_PREFIX: string = "/app";
  connectHeaders: StompHeaders = {
    Authentication: this.getTokenString(),
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
