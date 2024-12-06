<template lang="pug">
div(class='fixed top-10 end-1/2 translate-x-2/4 z-50')
  div(v-if='store.isModal' class="animate-modalUpDown bg-white p-3 border-2 rounded-lg shadow-md flex items-center justify-center rounded")
    a(class='font-normal px-2') {{$t(store.modalText)}}
</template>

<script setup>
const store = modalStore();
// 定義 props
defineProps({})
</script>

<style