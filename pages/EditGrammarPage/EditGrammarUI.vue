<template lang="pug">
VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
  form(@submit="handleSubmit($event, () => {$emit('submit-text')})" class='w-full flex-1')
    div(class='flex justify-center items-center flex-col')
      div(class='w-full flex-1')
        Card(class='flex justify-center items-center flex-col mt-4')
          div(class='flex w-full')
            div(class='flex flex-col w-full')
              a(class='w-full text-xl font-bold mb-1 text-gray-800') {{$t('grammar_text')}}
              VeeField(name="text" type="text" :modelValue="propsGrammarInput" v-slot="{ field, value }")
                input(
                  :placeholder="$t('please_enter_grammar_text')"
                  class='w-full text-lg'
                  v-bind="field"
                  :value='value'
                  @input='$emit("update:propsGrammarInput", $event.target.value)'
                )
              VeeErrorMessage(name="text" class='ml-2.5 w-full text-red-700 text-sm')
          div(class='flex flex-col w-full')
            a(class='w-full text-xl font-bold mt-2 mb-1 text-gray-800') {{`${$t('grammar_translation')}(${$t('optional')})`}}
            input(
              :placeholder="$t('please_enter_grammar_translation')"
              :value='propsGrammarTransInput'
              class=' w-full text-lg'
              @input='$emit("update:propsGrammarTransInput", $event.target.value)'
            )
        Card(class='mt-2.5 flex-col')
          a(class='w-full text-xl font-bold') {{`${$t('example_sentence')}(${$t('optional')})`}}
          textarea(
            :placeholder="`${$t('please_enter_example_sentence')}(${$t('optional')})`"
            :value='propsSentenceInput'
            class='my-2.5 w-full text-lg'
            @input='$emit("update:propsSentenceInput", $event.target.value)'
          )
          div(class='w-full flex flex-row mb-2' @click='$emit("add-input")')
            div(class='flex justify-center items-center') 
              a(class='text-xl font-bold') {{$t('supple_words')}}
            div(class='ml-2 flex justify-center items-center')
              ImageFC(src='/img/add_circle_line.png' :width='20' :height='20')
          div(v-for='(input, index) in propsExtraTextInputs' :key='index' class='flex justify-center items-center flex-row')
            div(class="grid grid-cols-8 gap-4 mb-2.5")
              input(type='text', v-model='input.jpValue' :placeholder="$t('please_enter_word')" class="col-span-3")
              input(type='text', v-model='input.chValue' :placeholder="$t('please_enter_translate')" class="col-span-3")
              div(@click='$emit("remove-input", index)'  class='text-center col-span-2 custom-button') {{$t('delete')}}
        Card(class='mt-2.5 flex-col ')
          a(class='w-full mb-2 font-bold text-gray-500') {{$t('sample')}}
          div(class='w-full mb-2')
            a(class='text-xl font-medium') {{propsGrammarInput}}
            a(class='text-sm ml-4 text-gray-700') {{propsGrammarTransInput}}
          a(class='text-textSecond text-gray-500') {{propsSentenceInput}}
          template(v-if='propsExtraTextInputs?.length > 0')
            div(class='border-b-2 my-2.5' )
          div(v-for='(input, index) in propsExtraTextInputs' :key='index')
            div
              a(class='mr-2 font-medium text-gray-800 text-lg') {{input.jpValue}}
              a(class='text-textSecond text-gray-500 text-sm') {{input.chValue}}
      LoadingBN(
        :type="'submit'" 
        :customClass="'mt-8 w-80'"
        :text="'submit'"
        :disabled="propsIsSubmit"
      )
  div(class="mt-4 w-full flex justify-center")
    LoadingBN(
      @click='$emit("delete-text")'
      :customClass="'mt-4 w-80'"
      :text="'delete'"
      :disabled="propsIsSubmit"
    )
</template>

<script setup>
// @ i18
const { t } = useI18n()
// @validation
import * as yup from 'yup';
const schema = yup.object({
  text: yup.string().required(t('required')) // type string required
}); // 自定義驗證綱要

defineProps({
  propsGrammarInput: String,
  propsGrammarTransInput: String,
  propsSentenceInput: String,
  propsExtraTextInputs: Array,
  propsIsSubmit: Boolean,
})

defineEmits([
  'update:propsGrammarInput',
  'update:propsGrammarTransInput',
  'update:propsSentenceInput',
  'update:propsExtraTextInputs',
  'submit-text',
  'delete-text',
  'add-input',
  'remove-input',
])

defineExpose({
  schema,
})


</script>