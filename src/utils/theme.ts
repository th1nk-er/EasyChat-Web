function updateTheme(e: any) {
  const htmlElement = document.documentElement;
  if (e && e.matches) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
}
// 初始化主题
updateTheme(window.matchMedia("(prefers-color-scheme: dark)"));
// 添加监听器
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateTheme);
