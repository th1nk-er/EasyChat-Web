import type { UserRole } from "../user/types";

export type UserGroupVo = {
  groupId: number;
  groupName: string;
  groupDesc?: string;
  avatar: string;
  role: UserRole;
  groupRemark?: string;
};
