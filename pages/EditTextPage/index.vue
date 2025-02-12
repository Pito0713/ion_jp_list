<template lang="pug">
LayoutsPage(class='mb-16')
  EditTextUI
</template>
<script setup>
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import EditTextUI from './EditTextUI.vue'

defineComponent({
  components: { LayoutsPage, EditTextUI },
})

</script>