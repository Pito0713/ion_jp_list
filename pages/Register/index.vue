<template lang="pug">
LayoutsPage(class='flex justify-center items-center h-vh flex-col mt-40')
  RegisterUI
</template>

<script setup>
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import RegisterUI from './RegisterUI.vue';
defineComponent({
  components: { LayoutsPage, RegisterUI },
})

</script>