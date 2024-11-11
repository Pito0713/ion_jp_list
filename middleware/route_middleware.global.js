import { authStore } from '../../store/authStore'

export default defineNuxtRouteMiddleware((to, from) => {
  // const auth = authStore()
  let userToken = useCookie('userToken')
  console.log(userToken.value)

  // 有token 轉跳至登入頁 返回主頁
  if (userToken.value) {
    if (['/LogInPage', '/LogInPage/addLogInPage'].includes(to.path)) return navigateTo('/')
  }

  // 無token 非登入頁 轉跳進登入頁
  if (!userToken.value) {
    if (!['/LogInPage', '/LogInPage/addLogInPage'].includes(to.path)) return navigateTo('/LogInPage')
  }

})