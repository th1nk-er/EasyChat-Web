export type SearchResult = {
  id: number;
  username: string;
  nickname: string;
  sex: UserSex;
};

export enum UserSex {
  MALE = 0,
  FEMALE = 1,
  SECRET = 2,
}
