<template lang="pug">
VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
  form(@submit="handleSubmit($event, () => {$emit('submit-text')})" class='w-full flex-1')
    div(class='flex justify-center items-center flex-col custom-container')
      div(class='w-full flex-1')
        Card(class='flex justify-center items-center flex-col mt-4')
          div(class='flex w-full')
            div(class='flex flex-col w-1/2 mr-2')
              a(class='text-xl mb-2 font-bold') {{$t('words_Kanji')}}
              VeeField(name="text" type="text" :modelValue="propsTextInput" v-slot="{ field, value }")
                input(
                  :placeholder="$t('please_enter_words_Kanji')"
                  class='w-full text-lg'
                  v-bind="field"
                  :value='value'
                  @input='$emit("update:propsTextInput", $event.target.value)'
                )
              VeeErrorMessage(name="text" class='ml-2.5 w-full text-red-700 text-sm')
            div(class='flex flex-col w-1/2 mr-2')
              a(class='text-xl mb-2 font-bold') {{`${$t('hiragana_words')}(${$t('optional')})`}}
              input(
                :placeholder="$t('please_enter_hiragana_words')"
                class=' w-full text-lg'
                :value='propsTextHiraganaInput'
                @input='$emit("update:propsTextHiraganaInput", $event.target.value)'
              )
          div(class='flex flex-col w-full')
            a(class='w-full text-base font-bold mt-2 mb-1 text-gray-800') {{`${$t('word_translation')}(${$t('optional')})`}}
            input(
              :placeholder="$t('please_enter_word_translation')"
              class='w-full text-lg'
              :value='propsTextTransInput'
              @input='$emit("update:propsTextTransInput", $event.target.value)'
            )
          div(class='flex flex-row w-full ml-2')
            template(v-for='(item, index) in propsTagArray' :key='item')
              Tag(@click='$emit("select-tag",index)' :class='item.active && "bg-primary-color text-white"')
                a(:class='item.active && "bg-primary-color text-white"') {{$t(item.name)}}
        Card(class='mt-2.5 flex-col')
          a(class='w-full text-xl font-bold') {{`${$t('sentences')} / ${$t('translate')}(${$t('optional')})`}}
          textarea(
            :placeholder="`${$t('please_enter')}${$t('sentences')} / ${$t('translate')}(${$t('optional')})`"
            class='my-2.5 w-full text-lg'
            :value='propsTransInput'
            @input='$emit("update:propsTransInput", $event.target.value)'
          )
          div(class='w-full flex flex-row mb-2' @click='$emit("add-input")')
            div(class='flex justify-center items-center') 
              a(class='text-xl font-bold') {{$t('supple_words')}}
            div(class='ml-2 flex justify-center items-center')
              ImageFC(src='/img/add_circle_line.png' :width='20' :height='20')
          div(v-for='(input, index) in propsInputs' :key='index' class='flex justify-center items-center flex-row')
            div(class="grid grid-cols-8 gap-4 mb-2.5")
              input(type='text', v-model='input.jpValue' :placeholder="$t('please_enter_word')" class="col-span-3")
              input(type='text', v-model='input.chValue' :placeholder="$t('please_enter_translate')" class="col-span-3")
              div(@click='$emit("remove-input", index)'  class='text-center col-span-2 custom-button') {{$t('delete')}}
        Card(class='mt-2.5 flex-col ')
          a(class='w-full  mb-2 font-bold text-gray-500') {{$t('sample')}}
          template(v-if='propsTagArray.length > 0')
            div(class='flex flex-row')
              template(v-for='(item, index) in propsTagArray' :key='item')
                a(v-if='item.active' class='mr-2 mb-1 text-gray-400 text-sm') {{$t(item.name)}}
          div(class='w-full mb-2')
            a(class='text-xl font-medium ') {{propsTextInput}}
            a(class='font-medium text-xs ml-1 text-gray-500') {{propsTextHiraganaInput}}
            a(class='text-sm ml-4') {{propsTextTransInput}}
          a(class='text-textSecond text-gray-500') {{propsTransInput}}
          template(v-if='propsInputs?.length > 0')
            div(class='border-b-2 my-2.5' )
          div(v-for='(input, index) in propsInputs' :key='index')
            div
              a(class='mr-2 font-medium text-gray-800 text-lg') {{input.jpValue}}
              a(class='text-textSecond text-gray-500 text-sm') {{input.chValue}}
      LoadingBN(
        :type="'submit'" 
        :customClass="'mt-8 w-80'"
        :text="'submit'"
      )
  div(class="mt-4 w-full flex justify-center")
    LoadingBN(
      @click='handleDelete()'
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
  propsTextInput: String,
  propsTextHiraganaInput: String,
  propsTextTransInput: String,
  propsTransInput: String,
  propsTagArray: Array,
  propsInputs: Array,
  propsIsSubmit: Boolean,
})

defineEmits([
  'update:propsTextInput',
  'update:propsTextHiraganaInput',
  'update:propsTextTransInput',
  'update:propsTransInput',
  'update:propsTagArray',
  'select-tag',
  'submit-text',
  'delete-text',
  'add-input',
  'remove-input',
])

defineExpose({
  schema,
})


</script>