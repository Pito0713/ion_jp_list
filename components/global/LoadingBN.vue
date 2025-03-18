<template lang="pug">
button(
  class='flex disabled:bg-slate-500 justify-center items-center text-center' 
  :disabled='loadingIndicator.isLoading.value || disabled' 
  :class='customClass'
  :type='type'
) {{$t(text)}}
  img(v-if='loadingIndicator.isLoading.value' src="/img/loading.svg" alt="loading" width="25" height="25" class='ml-2')
</template>

<script setup>
const loadingIndicator = useLoadingIndicator();

defineExpose({
  loadingIndicator,
})

defineProps({
  text: {
    type: String,
    default: 'test', // 按鈕文字
  },
  disabled: {
    type: Boolean,
    default: false, // 設定是否禁用
  },
  type: {
    type: String,
    default: 'text', // 按鈕 type 
  },
  customClass: {
    type: String,
    default: '', // 用於自定義類
  },
})

</script>