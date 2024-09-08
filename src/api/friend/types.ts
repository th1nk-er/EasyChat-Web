import type { UserSex } from "../user/types";

export type AddFriendParams = {
  userId: number;
  addId: number;
  addInfo: string;
};

export type UserFriendVo = {
  friendId: number;
  nickname: string;
  username: string;
  avatar: string;
  sex: UserSex;
  createTime: string;
  remark: string;
  muted: boolean;
};

export type FriendListVo = {
  total: number;
  pageSize: number;
  records: UserFriendVo[];
};

export type FriendRequestData = {
  total: number;
  pageSize: number;
  records: RequestRecord[];
};
export type RequestRecord = {
  id: number;
  nickname: string;
  username: string;
  sex: UserSex;
  avatar: string;
  addInfo: string;
  createTime: string;
  status: AddStatus;
  addType: AddType;
  strangerId: number;
  uid: number;
};
export type ReplyAddRequestData = {
  userId: number;
  id: number;
  status: AddStatus;
  remark?: string;
};

export enum AddType {
  ADD_OTHER = "ADD_OTHER",
  ADD_BY_OTHER = "ADD_BY_OTHER",
}
export enum AddStatus {
  PENDING = "PENDING",
  AGREED = "AGREED",
  REFUSED = "REFUSED",
  IGNORED = "IGNORED",
}
