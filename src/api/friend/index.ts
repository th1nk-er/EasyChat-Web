import request from "@/utils/service";
import type { AddFriendVo } from "./type";

/**
 * 发送好友申请
 */
export const sendAddRequest = (data: AddFriendVo) => {
  return request.post({
    url: "/friend/request",
    method: "post",
    data,
  });
};
