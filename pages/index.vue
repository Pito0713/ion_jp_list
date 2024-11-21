<template lang="pug">
LayoutsPage(class='flex justify-center items-center h-svh')
  button(@click='logOut' class='mt-4 w-80') {{$t('log_out')}}
  select(name='language' id='language' v-model='localeLanguage')
    option(v-for="locale in locales" :key="locale.code" :value="locale.code") {{ locale.name }}

</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import Card from '../../components/Card.vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import { authStore } from '../../store/authStore'
const auth = authStore()
const router = useRouter()
let userToken = useCookie('userToken')
let userInfo = useCookie('userInfo')
let i18n = useCookie('i18n_redirected')
const { locales, setLocale } = useI18n()
const localeLanguage = ref(i18n.value)

watch(localeLanguage, (value, pre) => {
  console.log(pre, value)
  if (pre !== value) setLocale(localeLanguage.value)
})

const logOut = () => {
  auth.setAuth(false)
  userToken.value = null
  userInfo.value = null
  router.push({ path: "/LogInPage" })
}
defineComponent({
  components: { Card, LayoutsPage },
})
defineExpose({
  logOut,
  localeLanguage,
  locales,
})

</script>