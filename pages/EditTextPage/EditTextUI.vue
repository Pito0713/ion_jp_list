<template lang="pug">
VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
  form(@submit="handleSubmit($event, onSubmit)" class='w-full flex-1')
    div(class='flex justify-center items-center flex-col custom-container')
      div(class='w-full flex-1')
        Card(class='flex justify-center items-center flex-col mt-4')
          div(class='flex w-full')
            div(class='flex flex-col w-1/2 mr-2')
              a(class='text-xl mb-2 font-bold') {{$t('words_Kanji')}}
              VeeField(name="text" type="text" v-slot="{ field }" v-model="textInput")
                input(:placeholder="$t('please_enter_words_Kanji')"  class='w-full text-lg' v-bind="field")
              VeeErrorMessage(name="text" class='ml-2.5 w-full text-red-700 text-sm')
            div(class='flex flex-col w-1/2 mr-2')
              a(class='text-xl mb-2 font-bold') {{`${$t('hiragana_words')}(${$t('optional')})`}}
              input(:placeholder="$t('please_enter_hiragana_words')" v-model="textHiraganaInput" class=' w-full text-lg')
          div(class='flex flex-col w-full')
            a(class='w-full text-base font-bold mt-2 mb-1 text-gray-800') {{`${$t('word_translation')}(${$t('optional')})`}}
            input(:placeholder="$t('please_enter_word_translation')" v-model="textTransInput" class='w-full text-lg')
          div(class='flex flex-row w-full ml-2')
            template(v-for='(item, index) in tagArray' :key='item')
              Tag(@click='handleTag(index)' :class='item.active && "bg-primary-color text-white"')
                a(:class='item.active && "bg-primary-color text-white"') {{$t(item.name)}}
        Card(class='mt-2.5 flex-col')
          a(class='w-full text-xl font-bold') {{`${$t('sentences')} / ${$t('translate')}(${$t('optional')})`}}
          textarea(:placeholder="`${$t('please_enter')}${$t('sentences')} / ${$t('translate')}(${$t('optional')})`" v-model="transInput" class='my-2.5 w-full text-lg')
          div(class='w-full flex flex-row mb-2' @click='handleAddInput')
            div(class='flex justify-center items-center') 
              a(class='text-xl font-bold') {{$t('supple_words')}}
            div(class='ml-2 flex justify-center items-center')
              ImageFC(src='/img/add_circle_line.png' :width='20' :height='20')
          div(v-for='(input, index) in inputs' :key='index' class='flex justify-center items-center flex-row')
            div(class="grid grid-cols-8 gap-4 mb-2.5")
              input(type='text', v-model='input.jpValue' :placeholder="$t('please_enter_word')" class="col-span-3")
              input(type='text', v-model='input.chValue' :placeholder="$t('please_enter_translate')" class="col-span-3")
              div(@click='handleRemoveInput(index)'  class='text-center col-span-2 custom-button') {{$t('delete')}}
        Card(class='mt-2.5 flex-col ')
          a(class='w-full  mb-2 font-bold text-gray-500') {{$t('sample')}}
          template(v-if='tagArray.length > 0')
            div(class='flex flex-row')
              template(v-for='(item, index) in tagArray' :key='item')
                a(v-if='item.active' class='mr-2 mb-1 text-gray-400 text-sm') {{$t(item.name)}}
          div(class='w-full mb-2')
            a(class='text-xl font-medium ') {{textInput}}
            a(class='font-medium text-xs ml-1 text-gray-500') {{textHiraganaInput}}
            a(class='text-sm ml-4') {{textTransInput}}
          a(class='text-textSecond text-gray-500') {{transInput}}
          template(v-if='inputs?.length > 0')
            div(class='border-b-2 my-2.5' )
          div(v-for='(input, index) in inputs' :key='index')
            div
              a(class='mr-2 font-medium text-gray-800 text-lg') {{input.jpValue}}
              a(class='text-textSecond text-gray-500 text-sm') {{input.chValue}}
      button(type="submit" class='mt-4 w-80') {{$t('submit')}}
      button(@click='handleDelete()' class='mt-4 w-80'  :disabled="isSubmit") {{$t('delete')}}
</template>

<script setup>
import { onMounted } from 'vue'
// @自定義 Hook
import { useEditTextHook } from './useEditTextHook'
const { t } = useI18n()
const { $configUtils } = useNuxtApp();

// @validation
import * as yup from 'yup';
const schema = yup.object({
  text: yup.string().required(t('required')) // type string required
}); // 自定義驗證綱要

const route = useRoute();

const {
  textInput,
  textHiraganaInput,
  textTransInput,
  tagArray,
  transInput,
  inputs,
  isSubmit,
  targetQuery,
  onSubmit,
  handleTag,
  handleAddInput,
  handleRemoveInput,
  handleDelete,
} = useEditTextHook()

/* 
* Nuxt useState
* 頁面掛載後, 調用 infoState 個人狀態資料
* 若 route.query 有 tag 對應資料進行啟用 active 狀態
*/
const infoState = useState('infoState')
onMounted(async () => {
  try {
    if (infoState?.value?.info?.tags?.length > 0) {
      tagArray.value = infoState?.value?.info?.tags.map(item => {
        // if item matches the TargetTag form routeDate return active true
        if (targetQuery?.tags?.length > 0) {
          let match = targetQuery?.tags.filter(_item => item === _item);
          if (match.length > 0) {
            return { name: item, active: true }
          }
        }
        return { name: item, active: false }
      });
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

onMounted(async () => {
  // update routeDate into the current Page
  try {
    if (route.query?.value) {
      textInput.value = targetQuery.file
      textTransInput.value = targetQuery.fileTranslate
      textHiraganaInput.value = targetQuery.fileHiragana
      transInput.value = targetQuery.translation
      inputs.value = targetQuery.inputs
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

defineExpose({
  schema,
})

</script>