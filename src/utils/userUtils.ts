export const getAvatarUrl = (avatar: string) => {
  return import.meta.env.VITE_AVATAR_BASE_URL + avatar;
};
