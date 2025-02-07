<template lang="pug">
LayoutsPage(class='mb-16')
  AddTextUI
</template>

<script setup>
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import AddTextUI from './AddTextUI.vue'

defineComponent({
  components: { LayoutsPage, AddTextUI },
})

</script>