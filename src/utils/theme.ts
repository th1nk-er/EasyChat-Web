function updateTheme(e: any) {
  const htmlElement = document.documentElement;
  if (e && e.matches) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
}
export const addAutoThemeListener = () => {
  updateTheme(window.matchMedia('(prefers-color-scheme: dark)'));
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateTheme);
};

export const removeAutoThemeListener = () => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', updateTheme);
};
