<template lang="pug">
div
  VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
    form(@submit="handleSubmit($event, () => $emit('submit-login'))")
      Card(class='flex-col')
        div(class='flex justify-center items-center mb-5')
          ImageFC(src='/img/title_icon.png' width='200' height='200')
        VeeField(type="text" name="account" :modelValue='propsAccount' v-slot="{ field, value}")
          label {{$t('account')}}
          input(
            type='text'
            autocomplete='username'
            :placeholder="$t('please_enter_account')"
            :value="value"
            class='w-full flex border border-current rounded-md mt-2 focus:outline-none'
            @input="$emit('update:propsAccount', $event.target.value)"
            v-bind="field"
          )
          VeeErrorMessage(name="account" class='ml-2 w-full text-red-700 text-sm')
        div(class='w-full my-2')
        VeeField(type="text" name="password" :modelValue='propsPassword' v-slot="{ field, value }")
          label {{$t('password')}}
          div(class='w-full flex border border-current rounded-md mt-2 justify-between')
            input(
              :type="propIsShowEye? 'text': 'password'"
              autocomplete='current-password'
              :placeholder="$t('please_enter_password')"
              :value="value"
              @input="$emit('update:propsPassword', $event.target.value)"
              v-bind="field"
              class='border-none w-5/6 focus:outline-none'
            )
            div(class="flex justify-center items-center w-1/6" @click='$emit("show-eye")')
              ImageFC(v-if='propIsShowEye' src='/img/eye-open.png' width='25' height='25')
              ImageFC(v-else src='/img/eye-close.png' width='25' height='25')
          VeeErrorMessage(name="password" class='ml-2 w-full text-red-700 text-sm')
        button(type="submit" class='mt-4 w-80') {{$t('login')}}
  div(class='mt-4 w-full justify-between flex align-center') 
    a(class='text-base text-end ml-2') {{config.public.appVersion}}
    NuxtLinkLocale(to="/Register") {{$t('account_register')}}
</template>

<script setup>
// @validation (使用 yup 進行表單驗證)
const { t } = useI18n() // i18n 
import * as yup from 'yup';
const schema = yup.object({
  account: yup.string().required(t('required')), // 帳號必填
  password: yup.string().required(t('required')), // 密碼必填
});
const config = useRuntimeConfig();

defineProps({
  propsAccount: String,
  propsPassword: String,
  onSubmit: Function,
  propIsShowEye: Boolean,
})

defineEmits([
  'update:propsAccount',
  'update:propsPassword',
  'submit-login',
  'show-eye'
])

defineExpose({
  schema,
  config
})
</script>