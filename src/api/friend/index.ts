import request from "@/utils/service";
import type { FriendRequestData, AddFriendVo, handleRequestData } from "./type";
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

/**
 * 处理好友请求
 */
export const handleAddRequest = (data: handleRequestData) => {
  return request.put<Result<null>>({
    url: "/friend/request",
    method: "put",
    data,
  });
};
