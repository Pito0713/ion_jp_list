<template lang="pug">
  LayoutsPage(class='mb-16')  
    VeeForm(v-slot="{ handleSubmit }" :validation-schema="schema" as="div")
      form(@submit="handleSubmit($event, onSubmit)" class='w-full flex-1')
        div(class='flex justify-center items-center flex-col')
          div(class='w-full flex-1')
            Card(class='flex justify-center items-center flex-col mt-4')
              div(class='flex w-full')
                div(class='flex flex-col w-1/2 mr-2')
                  a(class='text-xl mb-2 font-bold') {{$t('words_Kanji')}}
                  VeeField(name="text" type="text" v-slot="{ field }")
                    input(:placeholder="$t('please_enter_words_Kanji')" v-model="textInput" class='w-full text-base' v-bind="field")
                  VeeErrorMessage(name="text" class='ml-2.5 w-full text-red-700 text-sm')
                div(class='flex flex-col w-1/2 mr-2')
                  a(class='text-xl mb-2 font-bold') {{`${$t('hiragana_words')}(${$t('optional')})`}}
                  input(:placeholder="$t('please_enter_hiragana_words')" v-model="textHiraganaInput" class='w-full text-base')
              div(class='flex flex-col w-full')
                a(class='w-full text-base font-bold mt-2 mb-1 text-gray-800') {{`${$t('word_translation')}(${$t('optional')})`}}
                input(:placeholder="$t('please_enter_word_translation')" v-model="textTransInput" class='w-full text-base')
              div(class='flex flex-row w-full')
                template(v-for='(item, index) in tagArray' :key='item')
                  Tag(@click='handleTag(index)' :class='item.active && activeColor')
                    a(:class='item.active && activeColor') {{$t(item.name)}}
            Card(class='mt-2.5 flex-col')
              a(class='w-full text-xl font-bold') {{`${$t('sentences')} / ${$t('translate')}(${$t('optional')})`}}
              textarea(:placeholder="`${$t('please_enter')}${$t('sentences')} / ${$t('translate')}(${$t('optional')})`" v-model="transInput" class='my-2.5 w-full text-base')
              div(class='w-full flex flex-row mb-2' @click='addInput')
                div(class='flex justify-center items-center') 
                  a(class='text-xl font-bold') {{$t('supple_words')}}
                div(class='ml-2 flex justify-center items-center')
                  ImageFC(src='/img/add_circle_line.png' :width='20' :height='20')
              div(v-for='(input, index) in inputs' :key='index' class='flex justify-center items-center flex-row')
                div(class="grid grid-cols-8 gap-4 mb-2.5")
                  input(type='text', v-model='input.jpValue' :placeholder="$t('please_enter_word')" class="col-span-3 text-base")
                  input(type='text', v-model='input.chValue' :placeholder="$t('please_enter_translate')" class="col-span-3 text-base")
                  div(@click='remove(index)'  class='text-center col-span-2 custom-button') {{$t('delete')}}
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
          button(type="submit" class='mt-4 w-80' :disabled="isSubmit") {{$t('submit')}}
  </template>

<script setup>
import { ref, reactive, onMounted, watch, computed, defineComponent } from 'vue'
import LayoutsPage from '../../layouts/LayoutsPage.vue'

// ------- use config hook
const { $api } = useNuxtApp();
const loadingIndicator = useLoadingIndicator();

// ------- State
const textInput = ref(null);
const transInput = ref(null);
const textHiraganaInput = ref(null);
const textTransInput = ref(null);
const inputs = ref([]);
const tagArray = ref([])
const activeColor = ref('bg-primary-color text-white') // css variable
const isSubmit = ref(false) // 提交按鈕 avoid 重複點擊

// ------- router
const router = useRouter()

// ------- i18
const { t } = useI18n()
const localePath = useLocalePath()

// ------- validation
import * as yup from 'yup';
const schema = yup.object({
  text: yup.string().required(t('required')) // type string required
}); // 自定義驗證綱要

// 新增補充單字 input
const addInput = () => {
  inputs.value.push({ jpValue: '', chValue: '' })
}
/* 移除對應 input 資料
  inject: {
      _index: <Number> of items index
}*/
const remove = (_index) => {
  inputs.value.splice(_index, 1);
}
/*觸發對應 tag active 資料, 是否顯示
  inject: {
    _index: <Number> of items index
}*/
const handleTag = async (_index) => {
  tagArray.value[_index].active = !tagArray.value[_index].active
}

// @Api addText
// 登入
const onSubmit = async () => {
  loadingIndicator.start() // loading
  isSubmit.value = true // button loading disabled
  let submitData = {
    file: textInput.value, // <String>
    fileTranslate: textTransInput.value, // <String>
    fileHiragana: textHiraganaInput.value,// <String>
    translation: transInput.value, // <String>
    inputs: JSON.stringify(inputs.value),  // type Array turn type String for mongodb 
    tags: tagArray.value.filter(item => item.active).map(item => item.name),  //  <String>[]
  }
  // api
  let target = await $api.addText(submitData)
  // success
  if (target?.status === 1) {
    // localePath for i18 translate
    router.push(localePath("/TextPage"))
  }
  isSubmit.value = false // button loading disabled
  loadingIndicator.finish()  // loading
}

/* Nuxt useState
  頁面掛載後, 調用 infoState 個人狀態資料
  若 route.query 有 tag 對應資料進行啟用 active 狀態*/
const infoState = useState('infoState')
onMounted(async () => {
  try {
    // 取得 info state tag
    if (infoState?.value?.info?.tags?.length > 0) {
      tagArray.value = infoState?.value?.info?.tags.map(item => {
        // default value
        // ['verb', 'noun', 'adjective', 'particle']
        return { name: item, active: false }
      });
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

defineComponent({
  components: { LayoutsPage },
})
defineExpose({
  textInput,
  textTransInput,
  transInput,
  remove,
  addInput,
  onSubmit,
  schema,
  tagArray,
  activeColor,
  inputs,
  handleTag
})

</script>