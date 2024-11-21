<template lang="pug">
  template(v-if='isLoggedIn')
    div(class='flex justify-center items-center flex-col fixed z-50 w-dvw')
      nav(class='custom-container bg-white')
        div(class='flex border-2 py-4')
          div(class="w-24 text-center font-bold ")
          NuxtLinkLocale(to="/") {{$t('Home')}}
          div(class="w-24 text-center font-bold ")
          NuxtLinkLocale(to="/TextPage") {{$t('TextList')}}
  div(class="h-14 bg-gray-200")
  div(class='custom-layout')
    main(class='relative custom-container ')
      NuxtPage
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent, defineExpose } from 'vue'
import { authStore } from '../../store/authStore'
const auth = authStore()
const userToken = useCookie('userToken')?.value
const isLoggedIn = computed(() => {
  if ([null].includes(auth?.isAuthenticated)) return userToken
  else return auth?.isAuthenticated
})
defineComponent({
  components: {},
})
defineExpose({
  auth,
  isLoggedIn
})


</script>