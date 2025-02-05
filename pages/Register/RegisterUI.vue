<template lang="pug">
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
      div( class='w-full my-2' )
      VeeField(type="text" name="passwordAgain" v-slot="{ field }")
        label {{$t('please_enter_password_again')}}
        input(type='text' :placeholder="$t('please_enter_password_again')" v-model="passwordAgain" class='w-full ' v-bind="field")
        VeeErrorMessage(name="passwordAgain" class='ml-2 w-full text-red-700 text-sm')
      div( class='w-full my-2' )
      button(type="submit" class='mt-4 w-80') {{$t('register')}}
</template>

<script setup>
// 引入 Vue 相關函數
import { ref, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import { useRegisterHook } from './useRegisterHook' // 引入 Register Hook
import * as yup from 'yup'; // yup 表單驗證
const { t } = useI18n() // i18n

const { onSubmit } = useRegisterHook() // Hook
const account = ref(null);
const password = ref(null);
const passwordAgain = ref(null);

// 定義表單驗證規則
const schema = yup.object({
  account: yup.string().required(t('required')), // 帳號必填
  password: yup.string().required(t('required')), // 密碼必填
  passwordAgain: yup
    .string()
    .oneOf([yup.ref('password'), null], t('password_inconsistent_please_re_enter')) // 必須與 password 一致
    .required(t('required')) // 必填
});

defineComponent({
  components: { LayoutsPage },
})

// 將變數與方法暴露給父元件
defineExpose({
  account,
  password,
  passwordAgain,
  onSubmit,
  schema,
  yup,
})
</script>