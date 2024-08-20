import { addAutoThemeListener, removeAutoThemeListener } from "@/utils/theme";
import { ThemePrefer } from "@/views/Setting/components/types";
import { defineStore } from "pinia";

export const useSettingStore = defineStore("Setting", {
  state: () => ({
    themePreference: ThemePrefer.SYSTEM,
  }),
  actions: {
    updateTheme(theme?: ThemePrefer) {
      if (theme) this.themePreference = theme;
      switch (this.themePreference) {
        case ThemePrefer.DARK:
          removeAutoThemeListener();
          document.documentElement.classList.add("dark");
          break;
        case ThemePrefer.LIGHT:
          removeAutoThemeListener();
          document.documentElement.classList.remove("dark");
          break;
        case ThemePrefer.SYSTEM:
          addAutoThemeListener();
          break;
      }
    },
  },
  persist: {},
});
