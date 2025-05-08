<template lang="pug">
  div(class='fixed top-16 end-1/2 translate-x-2/4 z-50')
    div(
      v-if='store.isModal' 
      class="animate-modalUpDown p-3 rounded-lg shadow-md flex items-center justify-center rounded"
      :class='activeColor()'
    )
      a(class='font-normal px-2') {{$t(store.modalText)}}
  </template>

<script setup>
import { ref } from 'vue'
const store = modalStore();
const primary_color = ref('bg-white')
const failed_color = ref('bg-red-200')
const success_color = ref('bg-blue-100')
const activeColor = () => {
  if (!['', undefined, null].includes(store.modalStatus)) {
    // 若 httpCode = '200' return success
    if (store.modalStatus === 'success') return success_color.value
    if (![200].includes(store.modalStatus)) return failed_color.value
  } else return primary_color.value // color
}
// 定義 props
defineExpose({
  activeColor,
  store
})
</script>