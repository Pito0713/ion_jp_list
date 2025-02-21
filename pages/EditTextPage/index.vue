<template lang="pug">
LayoutsPage(class='mb-16')
  EditTextUI(
    v-model:propsTextInput='textInput'
    v-model:propsTextHiraganaInput='textHiraganaInput'
    v-model:propsTextTransInput='textTransInput'
    v-model:propsTagArray='tagArray'
    v-model:propsTransInput='transInput'
    @select-tag='handleTag'
    @add-input='handleAddInput'
    @remove-input='handleRemoveInput'
    @delete-text='handleDelete'
    @submit-text='onSubmit'
    :propsIsSubmit='isSubmit'
    :propsTagArray='tagArray'
    :propsInputs='inputs'
  )
</template>
<script setup>
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import EditTextUI from './EditTextUI.vue'
// @自定義 Hook
import { useEditTextHook } from './useEditTextHook'

// 解構 useEditTextHook 
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
  handleRemoveInput,
  handleDelete,
} = useEditTextHook()

defineExpose({
  tagArray,
  isSubmit,
  transInput,
  inputs,
  textInput,
  textHiraganaInput,
  textTransInput,
  onSubmit,
  handleTag,
  handleAddInput,
  handleRemoveInput,
  handleDelete,
})


defineComponent({
  components: { LayoutsPage, EditTextUI },
})

</script>