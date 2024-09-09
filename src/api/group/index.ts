import service from '@/utils/service';
import type { Result } from '../types';
import type { GroupInvitationVo, UserGroupVo } from './types';
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
