export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
  middleware manages route on user authtoken state.
  全局狀態: authState , navState
  cookies: i18n
  邏輯:
    1. 檢查 authState 是否有 token 值 .
    2. 篩選 all router 並且進行 權限分類
    3. 透過 auth 是否 導向  HomePage 跟 LogInPage.
    4. 控制 navState 在頁面 navbar 顯示.
  */
  const authState = useState('authState') // 定義 authState 
  const navState = useState('navState', () => null); // 定義 navState, 並預設初始值 null 

  // ----- Cookie value
  const i18n = useCookie('i18n_redirected_ion')?.value || 'zhTW'  // default i18n
  const userToken = useCookie('userToken')?.value;

  // ----- Router value
  // 以下對 router 進行分類, 兩部分 unAuthRoutes, AuthRoutes
  const allRouter = useRouter().getRoutes().map(route => { return route.name }) // get all routes
  /* 
    flatMap 功能類似 map return 結果 
    並且進行 reduce 扁平化處理的值 
  */
  const unAuth = ['LogInPage', "index", 'Register'] // unauth routes
  const unAuthRoutes = [...new Set(
    unAuth.flatMap((e) => { return allRouter.filter(route => route.includes(e)) })
  )];
  const Auth = ['HomePage', 'TextPage', 'AddTextPage', 'EditTextPage'] // auth routes
  const AuthRoutes = [...new Set(
    Auth.flatMap((e) => { return allRouter.filter(route => route.includes(e)) })
  )];

  // 所有已設定的 routes
  const definedRoutes = new Set([...unAuthRoutes, ...AuthRoutes]);

  // 檢查未被設定的 routes
  const undefinedRoutes = allRouter.filter(route => !definedRoutes.has(route));

  if (undefinedRoutes.length > 0) {
    console.warn(`** ${undefinedRoutes.join(', ')} ** this route not setting`);
  }

  // Condition: 有auth token 但是導向無權限的 route
  if (unAuthRoutes.includes(to.name)) {
    if (authState.value?.token) {
      navState.value = { nav: true }; // set navbar useState to true
      // 非法轉跳回首頁
      return navigateTo(`/${i18n}/HomePage`)
    }
  }

  // Condition: 無 auth token 但是導向 有權限 route
  if (AuthRoutes.includes(to.name)) {
    // if (!authState.value?.token) {
    //   navState.value = { nav: false }; // set navbar useState to false
    //   // 非法轉跳登入頁
    //   return navigateTo(`/${i18n}/LogInPage`)
    // }
  }

  // Condition: 不包含在專案內 route 進行 auth 判斷轉跳
  if ([`index___${i18n}`].includes(to.name) || !allRouter.includes(to.name)) {
    if (userToken) return navigateTo(`/${i18n}/HomePage`)
    else return navigateTo(`/${i18n}/LogInPage`)
  }
})