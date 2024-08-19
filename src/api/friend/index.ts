import request from "@/utils/service";
import type {
  FriendRequestData,
  AddFriendVo,
  ReplyAddRequestData,
  FriendListVo,
  UserFriendVo,
} from "./types";
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
export const replyAddRequest = (data: ReplyAddRequestData) => {
  return request.put<Result<null>>({
    url: "/friend/request",
    method: "put",
    data,
  });
};

/**
 * 获取用户好友列表
 */
export const getUserFriendList = (page: number) => {
  return request.get<Result<FriendListVo>>({
    url: `/friend/list/${page}`,
    method: "get",
  });
};

/**
 * 获取好友信息
 */
export const getFriendInfo = (friendId: number) => {
  return request.get<Result<UserFriendVo>>({
    url: `/friend/info/${friendId}`,
    method: "get",
  });
};

/**
 * 修改好友的信息
 * @param data 修改后的信息
 */
export const updateFriendInfo = (data: UserFriendVo) => {
  return request.put<Result<null>>({
    url: `/friend/info`,
    method: "put",
    data,
  });
};

/**
 * 删除好友
 * @param friendId 好友ID
 */
export const deleteFriend = (friendId: number) => {
  return request.delete<Result<null>>({
    url: `/friend/${friendId}`,
    method: "delete",
  });
};
