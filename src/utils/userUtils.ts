import { UserRole, UserSex } from '@/api/user/types';
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

export const getRoleString = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return '管理员';
    case UserRole.LEADER:
      return '群主';
    case UserRole.USER:
      return '用户';
    default:
      return '未知';
  }
};
