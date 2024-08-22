export const getChatImgUrl = (img: string) => {
  if (img) return import.meta.env.VITE_CHAT_IMAGE_URL + img;
  return "";
};
