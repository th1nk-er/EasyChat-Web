export type SearchResult = {
  total: number;
  pageSize: number;
  records: {
    id: number;
    username: string;
    nickname: string;
    sex: UserSex;
  }[];
};

export enum UserSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  SECRET = "SECRET",
}
