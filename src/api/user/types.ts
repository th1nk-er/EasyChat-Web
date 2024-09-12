export type SearchResult = {
  total: number;
  pageSize: number;
  records: StrangerVo[];
};

export type StrangerVo = {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  sex: UserSex;
};

export enum UserSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  SECRET = 'SECRET',
}
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
}
export type UserVo = {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  loginType: number;
  sex: UserSex;
  locked: boolean;
  createTime: string;
  updateTime: string;
};
export type UpdatePasswordParams = {
  userId: number;
  code: string;
  newPassword: string;
};
export type UpdateUserInfoParams = {
  userId: number;
  nickname: string;
  sex: UserSex;
};
