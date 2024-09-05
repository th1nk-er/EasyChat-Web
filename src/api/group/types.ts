import type { UserRole } from "../user/types";

export enum GroupInvitationStatus {
  PENDING = "PENDING", // 待处理
  ACCEPTED = "ACCEPTED", // 已同意
  REJECTED = "REJECTED", // 已拒绝
  EXPIRED = "EXPIRED", // 已过期
  ADMIN_PENDING = "ADMIN_PENDING", // 等待管理员处理
  ADMIN_ACCEPTED = "ADMIN_ACCEPTED", // 管理员同意
  ADMIN_REJECTED = "ADMIN_REJECTED", // 管理员拒绝
}

export type UserGroupVo = {
  groupId: number;
  groupName: string;
  groupDesc?: string;
  avatar: string;
  role: UserRole;
  muted: boolean;
  groupRemark?: string;
};

export type GroupInvitationVo = {
  groupId: number;
  groupName: string;
  groupAvatar: string;
  invitedByUsername: string;
  invitedByNickname: string;
  invitedByRemark: string;
  status: GroupInvitationStatus;
  createTime: string;
};
