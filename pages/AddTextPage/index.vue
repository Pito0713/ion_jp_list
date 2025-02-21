<template lang="pug">
LayoutsPage(class='mb-16')
  AddTextUI(
    v-model:propsTextInput='textInput'
    v-model:propsTextHiraganaInput='textHiraganaInput'
    v-model:propsTextTransInput='textTransInput'
    v-model:propsTransInput='transInput'
    :propsTagArray='tagArray'
    :propsInputs='inputs'
    :propsIsSubmit='isSubmit'
    @submit-add='onSubmit'
    @handle-tag='handleTag'
    @add-input='handleAddInput'
    @remove-input='handleRemoveInput'
  )
</template>

<script setup>
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import AddTextUI from './AddTextUI.vue'
// @自定義 hook
import { useAddTextHook } from './useAddTextHook'

// 解構 useTextHook 
const {
  textInput,
  textHiraganaInput,
  textTransInput,
  tagArray,
  transInput,
  inputs,
  isSubmit,
  onSubmit,
  handleTag,
  handleAddInput,
  handleRemoveInput
} = useAddTextHook()

defineComponent({
  components: { LayoutsPage, AddTextUI },
})

defineExpose({
  textInput,
  textHiraganaInput,
  textTransInput,
  tagArray,
  transInput,
  inputs,
  isSubmit,
  onSubmit,
  handleTag,
  handleAddInput,
  handleRemoveInput,
})


</script>