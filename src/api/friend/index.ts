import request from "@/utils/service";
import type { FriendRequestData, AddFriendVo } from "./type";
import type { Result } from "../types";

/**
 * 发送好友申请
 */
export const sendAddRequest = (data: AddFriendVo) => {
  return request.post<Result<null>>({
    url: "/friend/request",
    method: "post",
    data,
  });
};

/**
 * 获取好友申请列表
 */
export const getAddRequestList = (page: number) => {
  return request.get<Result<FriendRequestData>>({
    url: `/friend/request/${page}`,
    method: "get",
  });
};
