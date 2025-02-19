<template lang="pug">
LayoutsPage(class='flex justify-center items-center h-vh flex-col mt-40')
  RegisterUI(
    v-model:propsAccount='account',
    v-model:propsPassword='password',
    v-model:propsPasswordAgain='passwordAgain',
    @submit-register='onSubmit'
  )
</template>

<script setup>
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import RegisterUI from './RegisterUI.vue';
import { useRegisterHook } from './useRegisterHook';

const {
  account,
  password,
  passwordAgain,
  onSubmit
} = useRegisterHook()

defineComponent({
  components: { LayoutsPage, RegisterUI },
})

defineExpose({
  account,
  password,
  passwordAgain,
  onSubmit
})

</script>