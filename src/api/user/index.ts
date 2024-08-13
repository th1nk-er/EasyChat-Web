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

/**
 * 修改头像
 * @param formData 表单数据
 * @returns 上传后的头像路径
 */
export const changeAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file, file.name);
  return request.upload<Result<string>>({
    url: "/user/avatar",
    data: formData,
  });
};
