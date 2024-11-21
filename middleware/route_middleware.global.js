import { authStore } from '../../store/authStore'

export default defineNuxtRouteMiddleware((to, from) => {
  // const auth = authStore()
  let userToken = useCookie('userToken')?.value
  let i18n = useCookie('i18n_redirected')?.value

  // 有token 轉跳至登入頁 返回主頁
  if (userToken) {
    if ([`/${i18n}/LogInPage`, `/${i18n}/LogInPage/addLogInPage`].includes(to.path)) return navigateTo(`/${i18n}`)
    return;
  }

  // 無token 非登入頁 轉跳進登入頁
  if (!userToken) {
    if (![`/${i18n}/LogInPage`, `/${i18n}/LogInPage/addLogInPage`].includes(to.path)) return navigateTo(`/${i18n}/LogInPage`)
    return;
  }

})