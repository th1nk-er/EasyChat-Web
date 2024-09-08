import request from "@/utils/service";
import type { Result } from "../types";
import type {
  AddFriendParams,
  FriendListVo,
  FriendRequestData,
  ReplyAddRequestData,
  UserFriendVo,
} from "./types";

/**
 * 发送好友申请
 */
export const sendAddRequest = (data: AddFriendParams) => {
  return request.post<Result<null>>({
    url: "/friend/request",
    method: "post",
    data,
  });
};

/**
 * 获取好友申请列表
 * @param userId 用户ID
 * @param page  页码
 */
export const getAddRequestList = (userId: number, page: number) => {
  return request.get<Result<FriendRequestData>>({
    url: `/friend/request/${userId}/${page}`,
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
 * @param userId 用户ID
 * @param page 页码
 */
export const getUserFriendList = (userId: number, page: number) => {
  return request.get<Result<FriendListVo>>({
    url: `/friend/list/${userId}/${page}`,
    method: "get",
  });
};

/**
 * 获取好友信息
 */
export const getFriendInfo = (userId: number, friendId: number) => {
  return request.get<Result<UserFriendVo>>({
    url: `/friend/info/${userId}/${friendId}`,
    method: "get",
  });
};

/**
 * 修改好友的信息
 * @param userId 用户ID
 * @param data 修改后的好友信息
 */
export const updateFriendInfo = (userId: number, data: UserFriendVo) => {
  return request.put<Result<null>>({
    url: `/friend/info/${userId}`,
    method: "put",
    data,
  });
};

/**
 * 删除好友
 * @param userId 用户ID
 * @param friendId 好友ID
 */
export const deleteFriend = (userId: number, friendId: number) => {
  return request.delete<Result<null>>({
    url: `/friend/${userId}/${friendId}`,
    method: "delete",
  });
};
