import { authStore } from '../../store/authStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = authStore()
  let userToken = useCookie('userToken')

  if (!userToken.value) {
    if (!['/LogInPage', '/LogInPage/addLogInPage'].includes(to.path) && !auth.isAuthenticate) {
      return navigateTo('/LogInPage')
    }
  }
})