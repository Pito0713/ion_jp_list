<template lang="pug">
div(class='bg-gray-200 h-svh')
  div(class='flex justify-center items-center flex-col')
    nav(class='custom-container bg-white')
      div(class='flex border-2 py-4')
        div(class="w-24 text-center font-bold ")
          NuxtLink(to="/") Home
        div(class="w-24 text-center font-bold ")
          NuxtLink(to="/TextPage") TextPage
  main(class='relative flex-1')
    NuxtPage
</template>

<script setup>
import LayoutsPage from './LayoutsPage.vue'
defineComponent({
  components: { LayoutsPage },
})
</script>