<template lang="pug">
div
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
    NuxtLinkLocale(to="/Register") {{$t('account_register')}}
  </template>

<script setup>
import { ref, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import { useLogInHook } from './useLogInHook' // 引入 LogIn Hook
const { t } = useI18n() // i18n 

const { onSubmit } = useLogInHook() // Hook
const account = ref(null);
const password = ref(null);

// ------- validation (使用 yup 進行表單驗證)
import * as yup from 'yup';
const schema = yup.object({
  account: yup.string().required(t('required')), // 帳號必填
  password: yup.string().required(t('required')), // 密碼必填
});

// 定義元件，並註冊 LayoutsPage
defineComponent({
  components: { LayoutsPage },
})

// 將變數與方法暴露給父元件
defineExpose({
  schema,
  onSubmit,
  account,
  password
})
</script>