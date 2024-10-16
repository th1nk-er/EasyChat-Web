import service from '@/utils/service';
import type { Result } from '../types';
import type {
  GroupAdminInvitationVo,
  GroupInvitationVo,
  GroupMemberInfoVo,
  GroupVo,
  UpdateUserGroupParams,
  UserGroupVo,
} from './types';
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
 * 获取用户的群聊邀请列表
 * @param userId 用户ID
 * @param page 页码
 */
export const getGroupInvitationList = (userId: number, page: number) => {
  return service.get<Result<GroupInvitationVo[]>>({
    url: `/group/invitation/list/${userId}/${page}`,
  });
};

/**
 * 获取用户管理的的群聊的邀请列表
 * @param userId 用户ID
 * @param page 页码
 */
export const getAdminGroupInvitationList = (userId: number, page: number) => {
  return service.get<Result<GroupAdminInvitationVo[]>>({
    url: `/group/invitation/manage/list/${userId}/${page}`,
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
 * @param groupId 群聊ID
 * @param groupRemark 群聊备注
 * @param muted 是否免打扰
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
