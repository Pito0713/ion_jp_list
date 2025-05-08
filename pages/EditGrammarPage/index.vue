<template lang="pug">
LayoutsPage(class='mb-16')
  EditGrammarUI(
    v-model:propsGrammarInput='grammarInput'
    v-model:propsGrammarTransInput='grammarTransInput'
    v-model:propsSentenceInput='sentenceInput'
    v-model:propsExtraTextInputs='extraTextInputs'
    @add-input='handleAddInput'
    @remove-input='handleRemoveInput'
    @delete-text='handleDelete'
    @submit-text='onSubmit'
    :propsIsSubmit='isSubmit'
  )
</template>
<script setup>
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import EditGrammarUI from './EditGrammarUI.vue'
// @自定義 Hook
import { useEditGrammarHook } from './useEditGrammarHook'

// 解構 useEditGrammarHook 
const {
  grammarInput,
  grammarTransInput,
  sentenceInput,
  extraTextInputs,
  isSubmit,
  onSubmit,
  handleAddInput,
  handleRemoveInput,
  handleDelete,
} = useEditGrammarHook()

defineExpose({
  grammarInput,
  grammarTransInput,
  sentenceInput,
  extraTextInputs,
  isSubmit,
  onSubmit,
  handleAddInput,
  handleRemoveInput,
  handleDelete,
})


defineComponent({
  components: { LayoutsPage, EditGrammarUI },
})

</script>