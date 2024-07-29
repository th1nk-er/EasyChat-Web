import { replyAddRequest } from "@/api/friend";
import { AddStatus } from "@/api/friend/type";

export const agreeRequest = async (id: number) => {
  await replyAddRequest({ id, status: AddStatus.AGREED });
};

export const refuseRequest = async (id: number) => {
  await replyAddRequest({ id, status: AddStatus.REFUSED });
};

export const ignoreRequest = async (id: number, remark?: string) => {
  await replyAddRequest({ id, status: AddStatus.IGNORED, remark });
};
