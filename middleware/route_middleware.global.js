export default defineNuxtRouteMiddleware(async (to, from) => {
  let i18n = useCookie('i18n_redirected')?.value || 'zhTW'
  const authState = useState('authState')
  const navState = useState('navState', () => null);
  const nuxtApp = useNuxtApp()
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    // 無token 非登入頁 轉跳進登入頁
    if (!authState.value?.token) {
      if (![`/${i18n}/LogInPage`, `/${i18n}/LogInPage/addLogInPage`].includes(to.path)) return navigateTo(`/${i18n}/LogInPage`)
      navState.value = { nav: false };
      return;
    }

    // // // 有token 轉跳至登入頁 返回主頁
    if (authState.value?.token) {
      if ([`/${i18n}/LogInPage`, `/${i18n}/LogInPage/addLogInPage`].includes(to.path)) return navigateTo(`/${i18n}`)
      navState.value = { nav: true };

      return;
    }
  }

})