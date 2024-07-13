import { LoginType } from "@/views/Login/components/userLogin";

export type UserLoginVo = {
  loginType?: LoginType;
  username?: string;
  password?: string;
  email?: string;
  verifyCode?: string;
};
// enum LoginType {
//   PASSWORD = 0,
//   EMAIL = 1,
// }

export type UserToken = {
  token?: string;
  issueTime?: number;
  expireTime?: number;
};
