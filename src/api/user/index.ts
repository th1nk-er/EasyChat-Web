import request from '@/utils/service';
import type { Result } from '../types';
import type {
  SearchResult,
  StrangerVo,
  UpdatePasswordParams,
  UpdateUserInfoParams,
  UserVo,
} from './types';

/**
 * 根据关键词搜索用户
 */
export const searchUser = (keyword: string, page: number) => {
  return request.get<Result<SearchResult>>({
    url: '/user/search',
    params: { keyword, page },
  });
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<Result<UserVo>>({
    url: '/user/info',
  });
};

/**
 * 修改密码
 * @param updatePasswordParams 修改密码参数
 */
export const changePassword = (updatePasswordParams: UpdatePasswordParams) => {
  return request.put<Result<null>>({
    url: `/user/password/`,
    data: updatePasswordParams,
  });
};
/**
 * 发送修改密码的验证邮件
 */
export const sendChangePasswordEmail = () => {
  return request.post<Result<null>>({
    url: '/user/email/change-password',
  });
};
/**
 * 修改头像
 * @param userId 用户id
 * @param file 头像文件
 * @returns 上传后的头像路径
 */
export const updateUserAvatar = (userId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  return request.upload<Result<string>>({
    url: `/user/avatar/${userId}`,
    data: formData,
  });
};

/**
 * 修改用户信息
 * @param updateUserInfo 更新的用户信息
 */
export const updateUserInfo = (updateUserInfo: UpdateUserInfoParams) => {
  return request.put<Result<null>>({
    url: '/user/info',
    data: updateUserInfo,
  });
};

/**
 * 获取陌生人信息
 * @param userId 用户ID
 * @returns
 */
export const getStrangerInfo = (userId: number) => {
  return request.get<Result<StrangerVo>>({
    url: `/user/info/${userId}`,
  });
};

/**
 *  用户登出
 */
export const userLogout = () => {
  return request.post<Result<null>>({
    url: '/user/logout',
  });
};
