import { UserSex } from '@/api/user/types';
export const getSexString = (sex: UserSex) => {
  switch (sex) {
    case UserSex.MALE:
      return '男';
    case UserSex.FEMALE:
      return '女';
    case UserSex.SECRET:
      return '保密';
    default:
      return '未知';
  }
};
