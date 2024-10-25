import type { UserRole, UserSex } from '../user/types';

export enum GroupNotificationType {
  PENDING = 'PENDING', // 待处理
  REJECTED = 'REJECTED', // 已拒绝
  EXPIRED = 'EXPIRED', // 已过期
  ADMIN_PENDING = 'ADMIN_PENDING', // 等待管理员处理
  ADMIN_ACCEPTED = 'ADMIN_ACCEPTED', // 管理员同意
  ADMIN_REJECTED = 'ADMIN_REJECTED', // 管理员拒绝
  QUITED = 'QUITED', // 退出
  KICKED = 'KICKED', // 被踢
  SET_ADMIN = 'SET_ADMIN', // 设置为管理员
  CANCEL_ADMIN = 'CANCEL_ADMIN', // 取消管理员
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
  invitedById: number;
  invitedByUsername: string;
  invitedByNickname: string;
  invitedByRemark: string;
  status: GroupNotificationType;
  createTime: string;
};

export type GroupAdminInvitationVo = {
  groupId: number;
  groupName: string;
  groupAvatar: string;
  invitedById: number;
  invitedByUsername: string;
  invitedByNickname: string;
  inviterId: number;
  inviterUsername: string;
  inviterNickname: string;
  status: GroupNotificationType;
  createTime: string;
};

export type GroupVo = {
  groupId: number;
  groupName: string;
  groupDesc: string;
  avatar: string;
  createTime: string;
  memberCount: number;
};

export type UpdateUserGroupParams = {
  groupId: number;
  muted?: boolean;
  groupRemark?: string;
};

export type GroupMemberInfoVo = {
  groupId: number;
  userId: number;
  userGroupNickname: string;
  role: UserRole;
  createTime: string;
  username: string;
  nickname: string;
  avatar: string;
  sex: UserSex;
};
