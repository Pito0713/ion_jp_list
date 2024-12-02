<template lang="pug">
  template(v-if="isLoggedIn")
    div(class='flex justify-center items-center flex-col fixed z-50 w-dvw')
      nav(class='custom-container bg-white')
        div(class='flex border-2 justify-between py-4')
          div(class='flex')
            div(class="w-24 font-bold flex justify-center items-center")
              NuxtLinkLocale(to="/") {{$t('Home')}}
            div(class="w-24 font-bold flex justify-center items-center")
              NuxtLinkLocale(to="/TextPage") {{$t('TextList')}} 
          div(class='flex')
            select(name='language' id='language' v-model='localeLanguage' class='flex border-2 w-28 mr-8 p-1 rounded')
              option(v-for="locale in locales" :key="locale.code" :value="locale.code") {{ locale.name }}    
            div(class="pr-4 flex justify-center items-center" @click='logOut()')
              img(src='/img/logout.png' width='25' height='25')
  div(class="h-14 bg-gray-200")
  div(class='flex justify-center items-center flex-col z-50 w-svw')
    div(class='custom-layout w-dvw')
      main(class='relative custom-container ')
        NuxtPage
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
const router = useRouter()
const route = useRoute()
let userToken = useCookie('userToken')
let userInfo = useCookie('userInfo')
let i18n = useCookie('i18n_redirected')
const navState = useState('navState')

const { locales, setLocale } = useI18n()
const localeLanguage = ref(i18n.value)
watch(localeLanguage, (value, pre) => {
  if (pre !== value) setLocale(localeLanguage.value)
})


const isLoggedIn = ref(null)
watch(route, (value, pre) => {
  if (navState?.value?.nav) isLoggedIn.value = true
  else isLoggedIn.value = false
})
onMounted(() => {
  if (navState?.value?.nav) isLoggedIn.value = true
  else isLoggedIn.value = false
})


const logOut = () => {
  userToken.value = null
  userInfo.value = null
  navState.value = { nav: false };
  clearNuxtState('authState')
  router.push({ path: "/LogInPage" })
}

defineComponent({
  components: {},
})
defineExpose({
  logOut,
  locales,
})


</script>