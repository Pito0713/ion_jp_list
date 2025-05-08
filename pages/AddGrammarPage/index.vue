<template lang="pug">
LayoutsPage(class='mb-16')
  AddGrammarUI(
    v-model:propsGrammarInput='grammarInput'
    v-model:propsGrammarTransInput='grammarTransInput'
    v-model:propsSentenceInput='sentenceInput'
    :propsExtraTextInputs='extraTextInputs'
    :propsIsSubmit='isSubmit'
    @submit-add='onSubmit'
    @add-input='handleAddInput'
    @remove-input='handleRemoveInput'
  )
</template>

<script setup>
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import AddGrammarUI from './AddGrammarUI.vue'
// @自定義 hook
import { useAddGrammarHook } from './useAddGrammarHook'

// 解構 useTextHook 
const {
  grammarInput,
  grammarTransInput,
  sentenceInput,
  extraTextInputs,
  isSubmit,
  onSubmit,
  handleAddInput,
  handleRemoveInput
} = useAddGrammarHook()

defineComponent({
  components: { LayoutsPage, AddGrammarUI },
})

defineExpose({
  grammarInput,
  grammarTransInput,
  sentenceInput,
  extraTextInputs,
  isSubmit,
  onSubmit,
  handleAddInput,
  handleRemoveInput,
})

</script>