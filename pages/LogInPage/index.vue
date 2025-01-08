<template lang="pug">
  LayoutsPage(class='h-vh flex justify-center items-center flex-col mt-40')
    VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
      form(@submit="handleSubmit($event, onSubmit)")
        Card(class='flex-col')
          VeeField(type="text" name="account" v-slot="{ field }")
            label {{$t('account')}}
            input(type='text' :placeholder="$t('please_enter_account')" v-model="account" class='w-full ' v-bind="field")
            VeeErrorMessage(name="account" class='ml-2 w-full text-red-700 text-sm')
          div( class='w-full my-2' )
          VeeField(type="text" name="password" v-slot="{ field }")
            label {{$t('password')}}
            input(type='text' :placeholder="$t('please_enter_password')" v-model="password" class='w-full ' v-bind="field")
            VeeErrorMessage(name="password" class='ml-2 w-full text-red-700 text-sm')
          button(type="submit" class='mt-4 w-80') {{$t('login')}}
    div( class='mt-4 w-80 text-end') 
      NuxtLinkLocale(to="/LogInPage/addLogInPage") {{$t('account_register')}}
  </template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'

// ------- router
const router = useRouter()
// ------- use config hook
const { $api } = useNuxtApp();
// ------- i18
const { t } = useI18n()
const localePath = useLocalePath()
// ------- StateManager
const authState = useState('authState', () => null); // 定義 authState, 並預設初始值 null 
const infoState = useState('infoState', () => null); // 定義 infoState, 並預設初始值 null 
const navState = useState('navState', () => {
  { nav: false };// 定義 navState, 並預設初始值 nav: false 
});
// ------- validation
import * as yup from 'yup';
const schema = yup.object({
  account: yup.string().required(t('required')), // type: string, required: true
  password: yup.string().required(t('required')),  // type: string, required: true
});
// ------- State
const account = ref(null);
const password = ref(null);

// @Api login api
// 登入
const onSubmit = async () => {
  let submitData = {
    account: account.value,
    password: password.value,
  }

  let target = await $api.login(submitData)

  // success 
  if (target?.status === 1) {
    // 定義 userToken cookie, 並且設定 maxAge 只保留規定時間
    let userToken = useCookie('userToken',
      {
        maxAge: 60 * 60 * 24 * 7 // 7 天
      })

    userToken.value = target?.data?.token // set the cookie

    // 定義 userInfo cookie, 並且設定 maxAge 只保留規定時間
    let userInfo = useCookie('userInfo',
      {
        maxAge: 60 * 60 * 24 * 7 // 7 天
      })
    userInfo.value = JSON.stringify(target?.data) // set the cookie

    authState.value = { token: target?.data?.token }; // set useState
    navState.value = { nav: true } // set useState
    infoState.value = { info: JSON.stringify(target?.data) }; // set useState
    router.push(localePath("/HomePage"))
  }
}

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  schema,
  onSubmit
})

</script>