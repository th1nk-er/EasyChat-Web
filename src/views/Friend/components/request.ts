import { replyAddRequest } from "@/api/friend";
import { AddStatus } from "@/api/friend/types";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
export const agreeRequest = async (id: number) => {
  await replyAddRequest({
    id: id,
    status: AddStatus.AGREED,
    userId: userStore.userInfo.id,
  });
};

export const refuseRequest = async (id: number) => {
  await replyAddRequest({
    id: id,
    status: AddStatus.REFUSED,
    userId: userStore.userInfo.id,
  });
};

export const ignoreRequest = async (id: number, remark?: string) => {
  await replyAddRequest({
    id: id,
    status: AddStatus.IGNORED,
    remark: remark,
    userId: userStore.userInfo.id,
  });
};
