import service from '@/utils/service';
import type { Result } from '../types';
import type {
  GroupNotificationVo,
  GroupMemberInfoVo,
  GroupVo,
  UpdateUserGroupParams,
  UserGroupVo,
  GroupMemberIgnoredVo,
  MuteMemberDto,
  GroupMemberMuteVo,
} from './types';
import type { UserRole } from '../user/types';
/**
 * 创建群聊
 * @param userId 用户ID
 * @param groupName 群聊名称
 * @param friendIds 邀请的好友ID
 * @returns
 */
export const createGroup = (
  userId: number,
  groupName: string,
  friendIds: number[]
) => {
  return service.post<Result<null>>({
    url: '/group/create',
    data: { userId, groupName, friendIds },
  });
};

/**
 * 获取用户的群聊列表
 * @param userId 用户ID
 * @param page 页码
 */
export const getGroupList = (userId: number, page: number) => {
  return service.get<Result<UserGroupVo[]>>({
    url: `/group/list/${userId}/${page}`,
  });
};

/**
 * 获取用户的群聊通知列表
 * @param userId 用户ID
 * @param page 页码
 */
export const getGroupInvitationList = (userId: number, page: number) => {
  return service.get<Result<GroupNotificationVo[]>>({
    url: `/group/notification/list/${userId}/${page}`,
  });
};

/**
 * 处理用户的群聊邀请
 * @param userId 用户ID
 * @param groupId 群组ID
 * @param accept 是否接受邀请
 */
export const userhandleGroupInvitation = (
  userId: number,
  groupId: number,
  accept: boolean
) => {
  return service.post<Result<null>>({
    url: '/group/invitation',
    data: { userId, groupId, accept },
  });
};
/**
 * 管理员处理用户的群聊邀请
 * @param userId 用户ID
 * @param groupId 群组ID
 * @param accept 是否接受邀请
 */
export const adminhandleGroupInvitation = (
  userId: number,
  groupId: number,
  accept: boolean
) => {
  return service.post<Result<null>>({
    url: '/group/invitation/manage',
    data: { userId, groupId, accept },
  });
};

/**
 * 获取群聊信息
 * @param groupId 群聊ID
 */
export const getGroupInfo = (groupId: number) => {
  return service.get<Result<GroupVo>>({
    url: `/group/info/${groupId}`,
  });
};

/**
 * 更新用户群聊信息
 * @param userId 用户ID
 * @param params 更新参数
 */
export const updateUserGroupInfo = (
  userId: number,
  params: UpdateUserGroupParams
) => {
  return service.put<Result<null>>({
    url: `/group//update/user/${userId}`,
    data: params,
  });
};

/**
 * 获取群成员信息
 * @param groupId 群聊ID
 * @param userId 用户ID
 */
export const getGroupmemberInfo = (groupId: number, userId: number) => {
  return service.get<Result<GroupMemberInfoVo>>({
    url: `/group/${groupId}/member/${userId}`,
  });
};

/**
 * 退出群组
 * @param userId 用户ID
 * @param groupId 群聊ID
 */
export const quitGroup = (userId: number, groupId: number) => {
  return service.delete<Result<null>>({
    url: `/group/quit/${userId}/${groupId}`,
  });
};

/**
 * 踢出群成员
 * @param userId 用户ID
 * @param groupId 群聊ID
 * @param memberId 被踢的成员ID
 * @returns
 */
export const kickGroupMember = (
  userId: number,
  groupId: number,
  memberId: number
) => {
  return service.delete<Result<null>>({
    url: `/group/kick/${userId}/${groupId}/${memberId}`,
  });
};

/**
 * 获取群成员详细信息
 * @param groupId 群聊ID
 * @param page 页码
 */
export const getGroupMemberList = (groupId: number, page: number) => {
  return service.get<Result<GroupMemberInfoVo[]>>({
    url: `/group/${groupId}/member/list/${page}`,
  });
};

/**
 * 邀请好友加入群聊
 * @param userId 用户ID
 * @param groupId 群聊ID
 * @param friendIds 邀请的好友ID列表
 * @returns
 */
export const inviteGroupMember = (
  userId: number,
  groupId: number,
  friendIds: number[]
) => {
  return service.post<Result<null>>({
    url: `/group/invite/${userId}/${groupId}`,
    data: friendIds,
  });
};

/**
 * 更新群成员昵称
 * @param userId 用户ID
 * @param groupId 群聊ID
 * @param nickname 昵称
 */
export const updateUserGroupNickname = (
  userId: number,
  groupId: number,
  nickname: string
) => {
  return service.put<Result<null>>({
    url: `/group/${groupId}/user/${userId}/nickname`,
    data: { nickname },
  });
};

/**
 * 更新群成员身份
 * @param userId 用户ID
 * @param groupId 群聊ID
 * @param memberId 成员ID
 * @param role 身份
 */
export const updateUserGroupRole = (
  userId: number,
  groupId: number,
  memberId: number,
  role: UserRole
) => {
  return service.put<Result<null>>({
    url: `/group/${groupId}/member/${memberId}/role`,
    data: { userId, role },
  });
};

/**
 * 获取用户对某个群聊中成员的屏蔽信息
 * @param userId 用户ID
 * @param groupId 群聊ID
 */
export const getGroupIgnored = (userId: number, groupId: number) => {
  return service.get<Result<GroupMemberIgnoredVo[]>>({
    url: `/group/${groupId}/${userId}/ignored/members`,
  });
};

/**
 * 忽略群成员
 * @param userId 用户ID
 * @param groupId 群聊ID
 * @param memberId 成员ID
 */
export const ignoreGroupMember = (
  userId: number,
  groupId: number,
  memberId: number
) => {
  return service.post<Result<null>>({
    url: `/group/${groupId}/${userId}/ignore/member/${memberId}`,
  });
};

/**
 * 取消忽略群成员
 * @param userId 用户ID
 * @param groupId 群聊ID
 * @param memberId 成员ID
 */
export const cancelIgnoreGroupMember = (
  userId: number,
  groupId: number,
  memberId: number
) => {
  return service.delete<Result<null>>({
    url: `/group/${groupId}/${userId}/ignore/member/${memberId}`,
  });
};

/**
 * 禁言群成员
 * @param dto 禁言参数
 */
export const muteGroupMember = (dto: MuteMemberDto) => {
  return service.post<Result<null>>({
    url: '/group/mute/member',
    data: dto,
  });
};

/**
 * 取消禁言群成员
 * @param groupId 群聊ID
 * @param memberId 成员ID
 * @param adminId 管理员ID
 */
export const calcelMuteGroupMember = (
  groupId: number,
  memberId: number,
  adminId: number
) => {
  return service.delete<Result<null>>({
    url: `/group/${groupId}/mute/member/${memberId}/${adminId}`,
  });
};

/**
 * 获取群成员禁言信息
 * @param groupId 群聊ID
 * @param memberId 成员ID
 */
export const getGroupMemberMuteInfo = (groupId: number, memberId: number) => {
  return service.get<Result<GroupMemberMuteVo>>({
    url: `/group/${groupId}/mute/status/member/${memberId}`,
  });
};
