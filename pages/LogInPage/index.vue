<template lang="pug">
LayoutsPage(class='h-vh flex justify-center items-center flex-col mt-40')
  LogInUI(
    v-model:propsAccount="account"
    v-model:propsPassword="password"
    :propIsShowEye="isShowEye"
    @submit-login="onSubmit"
    @show-eye="handleShowEye"
  )
</template>

<script setup>
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import LogInUI from './LogInUI.vue'
// @自定義 hook
import { useLogInHook } from './useLogInHook'

// 解構 useLogInHook 
const {
  onSubmit,
  account,
  password,
  isShowEye,
  handleShowEye,
} = useLogInHook()

defineComponent({
  components: { LayoutsPage, LogInUI },
})

defineExpose({
  account,
  password,
  onSubmit
})

</script>