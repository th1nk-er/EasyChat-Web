import { LoginType } from '@/views/Login/components/userLogin';

export type UserLoginVo = {
  type: LoginType;
  username: string;
  password: string;
  email: string;
  verifyCode: string;
};

export type UserToken = {
  token: string;
  issueTime: number;
  expireTime: number;
};
