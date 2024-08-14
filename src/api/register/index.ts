import request from "@/utils/service";
import type { RegisterVo } from "./types";
import type { Result } from "../types";

// 用户注册
export const register = (data: RegisterVo) => {
  return request.post<Result<null>>({
    url: "/user/register",
    data,
  });
};

export const sendVerifyCode = (email: string) => {
  return request.post<Result<string>>({
    url: "/user/email/register",
    method: "post",
    data: { email },
  });
};
