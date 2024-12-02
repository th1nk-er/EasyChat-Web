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
  GROUP_DISBAND = 'GROUP_DISBAND', // 群解散
}

export enum GroupStatus {
  NORMAL = 'NORMAL',
  DISBAND = 'DISBAND',
}

export type UserGroupVo = {
  groupId: number;
  groupName: string;
  groupDesc?: string;
  avatar: string;
  status: GroupStatus;
  role: UserRole;
  muted: boolean;
  groupRemark?: string;
};

export type GroupNotificationVo = {
  groupId: number;
  groupName: string;
  groupAvatar: string;
  targetId: number;
  targetUsername: string;
  targetNickname: string;
  operatorId: number;
  operatorUsername: string;
  operatorNickname: string;
  type: GroupNotificationType;
  createTime: string;
};

export type GroupVo = {
  groupId: number;
  groupName: string;
  groupDesc: string;
  avatar: string;
  status: GroupStatus;
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

export type GroupMemberIgnoredVo = {
  groupId: number;
  userId: number;
  ignoredId: number;
  createTime: string;
};

export type MuteMemberDto = {
  groupId: number;
  memberId: number;
  adminId: number;
  duration: number;
};

export type GroupMemberMuteVo = {
  groupId: number;
  userId: number;
  adminId: number;
  muted: boolean;
  muteTime: string;
  unmuteTime: string;
};

export type GroupUpdateParams = {
  userId: number;
  groupName: string;
  groupDesc: string;
};
