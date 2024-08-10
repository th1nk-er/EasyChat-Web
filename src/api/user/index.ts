import request from "@/utils/service";
import type { Result } from "../types";
import type { SearchResult, UserVo } from "./types";

/**
 * 根据关键词搜索用户
 */
export const searchUser = (keyword: string, page: number) => {
  return request.get<Result<SearchResult>>({
    url: "/user/search",
    params: { keyword, page },
  });
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<Result<UserVo>>({
    url: "/user/info",
  });
};

/**
 * 修改密码
 * @param code 邮箱验证码
 * @param newPassword 新密码
 */
export const changePassword = (code: string, newPassword: string) => {
  return request.put<Result<null>>({
    url: "/user/password",
    data: { code, newPassword },
  });
};
