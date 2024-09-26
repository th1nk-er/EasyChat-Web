export const getFileUrl = (fileName: string | undefined) => {
  if (fileName) return import.meta.env.VITE_FILE_BASE_URL + fileName;
  else return '';
};
