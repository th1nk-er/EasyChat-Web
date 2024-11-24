import { LoginType } from '@/views/Login/components/userLogin';

export type UserLoginVo = {
  type: LoginType;
  username: string;
  password: string;
  email: string;
  verifyCode: string;
};

export type UserToken = {
  id: number;
  token: string;
  issueTime: number;
  expireTime: number;
};
