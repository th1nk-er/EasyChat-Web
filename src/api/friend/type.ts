import type { UserSex } from "../user/types";

export type AddFriendVo = {
  addId: number;
  addInfo: string;
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
export type handleRequestData = {
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
