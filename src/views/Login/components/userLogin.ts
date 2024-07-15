export enum LoginType {
  PASSWORD = 0,
  EMAIL = 1,
}

const currentType = ref(LoginType.PASSWORD);

export function useLoginState() {
  const getLoginType = computed(() => currentType.value);
  const backToPasswordLogin = () => {
    currentType.value = LoginType.PASSWORD;
  };

  const toEmailLogin = () => {
    currentType.value = LoginType.EMAIL;
  };

  return {
    getLoginType,
    backToPasswordLogin,
    toEmailLogin,
  };
}
