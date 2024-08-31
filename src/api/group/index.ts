import service from "@/utils/service";
import type { Result } from "../types";
import type { UserGroupVo } from "./types";
/**
 * 创建群聊
 * @param groupName 群聊名称
 * @param friendIds 邀请的好友ID
 * @returns
 */
export const createGroup = (groupName: string, friendIds: number[]) => {
  return service.post<Result<null>>({
    url: "/group/create",
    data: { groupName, friendIds },
  });
};

/**
 * 获取用户的群聊列表
 * @param page 页码
 */
export const getGroupList = (page: number) => {
  return service.get<Result<UserGroupVo[]>>({
    url: `/group/list/${page}`,
  });
};
