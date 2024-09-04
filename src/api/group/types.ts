import type { UserRole } from "../user/types";

export type UserGroupVo = {
  groupId: number;
  groupName: string;
  groupDesc?: string;
  avatar: string;
  role: UserRole;
  muted: boolean;
  groupRemark?: string;
};
