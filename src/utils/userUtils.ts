import { UserSex } from "@/api/user/types";

export const getAvatarUrl = (avatar: string) => {
  if (avatar) return import.meta.env.VITE_AVATAR_BASE_URL + avatar;
  else return import.meta.env.VITE_AVATAR_BASE_URL + "/avatar/default.jpg";
};

export const getSexString = (sex: UserSex) => {
  switch (sex) {
    case UserSex.MALE:
      return "男";
    case UserSex.FEMALE:
      return "女";
    case UserSex.SECRET:
      return "保密";
    default:
      return "未知";
  }
};
