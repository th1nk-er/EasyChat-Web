export const getAvatarUrl = (avatar: string) => {
  if (avatar) return import.meta.env.VITE_AVATAR_BASE_URL + avatar;
  else return import.meta.env.VITE_AVATAR_BASE_URL + "/avatar/default.jpg";
};
