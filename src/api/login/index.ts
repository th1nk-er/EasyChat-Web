import request from "@/utils/service";
import type { UserLoginVo, UserToken } from "./types";
import type { Result } from "../types";

// 登录
export const login = (data: UserLoginVo) => {
  return request.post<Result<UserToken>>({
    url: "/user/login",
    method: "post",
    data,
  });
};
