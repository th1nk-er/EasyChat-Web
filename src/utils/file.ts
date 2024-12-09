export const getFileUrl = (fileName: string | undefined) => {
  if (fileName) return import.meta.env.VITE_FILE_BASE_URL + fileName;
  else return '';
};

export const getFileSizeStr = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size > 1024) {
    size /= 1024;
    i++;
  }
  return size.toFixed(2) + units[i];
};
