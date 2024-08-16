export type SearchResult = {
  total: number;
  pageSize: number;
  records: {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
    sex: UserSex;
  }[];
};

export enum UserSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  SECRET = "SECRET",
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

export type UpdateUserInfoParams = {
  nickname: string;
  sex: UserSex;
};
