<template lang="pug">
VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
  form(@submit="handleSubmit($event, () => $emit('submit-register'))")
    Card(class='flex-col')
      VeeField(type="text" name="account" :modelValue='propsAccount' v-slot="{ field, value}")
        label {{$t('account')}}
        input(
          type='text'
          :placeholder="$t('please_enter_account')"
          :value='value'
          @input="$emit('update:propsAccount', $event.target.value)"
          class='w-full'
          v-bind="field")
        VeeErrorMessage(name="account" class='ml-2 w-full text-red-700 text-sm')
      div( class='w-full my-2' )
      VeeField(type="text" name="password" :modelValue='propsPassword' v-slot="{ field, value}")
        label {{$t('password')}}
        input(
          type='text'
          :placeholder="$t('please_enter_password')"
          :value='value'
          @input="$emit('update:propsPassword', $event.target.value)"
          class='w-full'
          v-bind="field")
        VeeErrorMessage(name="password" class='ml-2 w-full text-red-700 text-sm')
      div( class='w-full my-2' )
      VeeField(type="text" name="passwordAgain" :modelValue='propsPasswordAgain' v-slot="{ field , value}")
        label {{$t('please_enter_password_again')}}
        input(
          type='text'
          :placeholder="$t('please_enter_password_again')"
          :value='propsPasswordAgain'
          @input="$emit('update:propsPasswordAgain', $event.target.value)"
          class='w-full'
          v-bind="field"
          )
        VeeErrorMessage(name="passwordAgain" class='ml-2 w-full text-red-700 text-sm')
      div( class='w-full my-2' )
      button(type="submit" class='mt-4 w-80') {{$t('register')}}
</template>

<script setup>
import * as yup from 'yup'; // yup 表單驗證
const { t } = useI18n() // i18n
const schema = yup.object({
  account: yup.string().required(t('required')), // 帳號必填
  password: yup.string().required(t('required')), // 密碼必填
  passwordAgain: yup
    .string()
    .oneOf([yup.ref('password'), null], t('password_inconsistent_please_re_enter')) // 必須與 password 一致
    .required(t('required')) // 必填
});

defineProps({
  propsAccount: String,
  propsPassword: String,
  propsPasswordAgain: String,
})

defineEmits([
  'submit-register',
  'update:propsAccount',
  'update:propsPassword',
  'update:propsPasswordAgain',
])
// 將變數與方法暴露給父元件
defineExpose({
  schema,
})
</script>