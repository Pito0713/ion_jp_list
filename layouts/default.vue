<template lang="pug">
Modal
template(v-if="isLoggedIn")
  div(class='flex justify-center items-center flex-col fixed z-40 w-dvw')
    nav(class='custom-container bg-white')
      div(class='flex border-2 justify-between py-4')
        div(class='flex')
          div(class="w-24 font-bold flex justify-center items-center")
            NuxtLinkLocale(to="/HomePage") {{$t('Home')}}
          div(class="w-24 font-bold flex justify-center items-center")
            NuxtLinkLocale(to="/TextPage") {{$t('TextList')}} 
        div(class='flex')
          select(name='language' id='language' v-model='localeLanguage' class='flex border-2 w-28 mr-8 p-1 rounded')
            option(v-for="locale in locales" :key="locale.code" :value="locale.code") {{ locale.name }}    
          div(class="pr-4 flex justify-center items-center" @click='logOut()')
            ImageFC(src='/img/log_out.png' width='25' height='25')
div(class="h-14 bg-gray-200")
div(class='flex justify-center items-center flex-col w-svw')
  div(class='custom-layout w-dvw')
    main(class='relative custom-container ')
      NuxtPage
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
// ------- router
const router = useRouter()
const route = useRoute()
// ------- Cookie
let userToken = useCookie('userToken')
let userInfo = useCookie('userInfo')
// ------- StateManager
const navState = useState('navState')
// ------- i18n
let i18n = useCookie('i18n_redirected_ion')
const localePath = useLocalePath()
const { locales, setLocale } = useI18n() // 提供給 i18 地區
const localeLanguage = ref(i18n.value)
watch(localeLanguage, (value, pre) => { // 若 locales 有變動
  if (pre !== value) setLocale(localeLanguage.value)
})

/* navbar 判斷用, 
抓取 useState value ,賦值 isLoggedIn 是否顯示*/
const isLoggedIn = ref(null)
watch(route, (value, pre) => {
  if (navState?.value?.nav) isLoggedIn.value = true
  else isLoggedIn.value = false
})
onMounted(() => {
  if (navState?.value?.nav) isLoggedIn.value = true
  else isLoggedIn.value = false
})

// 登出
const logOut = () => {
  userToken.value = null // 清除 cookies
  userInfo.value = null // 清除 cookies
  navState.value = { nav: false }; // set useState
  clearNuxtState('authState') // 內建原生function 清除useState狀態
  router.push(localePath("/LogInPage"))
}

defineComponent({
  components: {},
})
defineExpose({
  logOut,
  locales,
})


</script>