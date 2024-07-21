import request from "@/utils/service";
import type { Result } from "../types";
import type { SearchResult } from "./types";

/**
 * 根据关键词搜索用户
 */
export const searchUser = (keyword: string, page: number) => {
  return request.get<Result<SearchResult>>({
    url: "/user/search",
    params: { keyword, page },
  });
};
