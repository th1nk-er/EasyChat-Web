import request from '@/utils/service';
import type { Result } from '../types';
import type { UserTokenVo } from './types';

/**
 * 获取用户Token Vo列表
 * @param userId 用户ID
 * @returns
 */
export const getUserTokenVoList = (userId: number) => {
  return request.get<Result<UserTokenVo[]>>({
    url: `/security/token/list/user/${userId}`,
  });
};
