<template lang="pug">
div(class='relative flex justify-center items-center flex-col pb-16' id='scroll-container')
  div(class='w-full flex h-16 mt-2 mb-2' id='topUpElement')
  div(v-if='propIsTopUP' class='fixed w-10 h-10 bottom-20 right-6 md:right-1/2 md:translate-x-72' @click='$emit("scroll-To")')
    ImageFC(src='/img/topup_arrow.png' :width='35' :height='20')
  div(class='fixed w-12 h-12 bottom-4 right-6 md:right-1/2 md:translate-x-72')
    NuxtLinkLocale(to="AddGrammarPage")
      ImageFC(src='/img/add_text_circle.png' :width='50' :height='50')
  template(v-for='(item, index) in propList.data' :key='item._id')
    Card(class='flex flex-col justify-start items-start w-full mt-2 mb-0 p-3')
      div(class='w-full flex flex-row')
        div(class='w-9/12  flex sm:flex-row flex-col justify-start sm:items-center items-start mb-1')
          a(class='text-2xl font-medium mr-2 ') {{item.grammarInput}}
          div(class='flex flex-row  justify-start items-start')
            a(v-if='item.grammarTransInput' class=' text-sm font-medium ml-1 mr-1 mt-2 text-gray-500') {{item.grammarTransInput}}
            div(@click='$emit("copy-text")'  class='active:opacity-20 mt-2') 
              ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
        div(class='w-3/12 flex flex-row justify-end items-center')
          NuxtLink(:to="{ path:localePath('EditGrammarPage'), query: { value: $configUtils.encodeBase64(item) } }" class='mr-3')
            ImageFC(src='/img/item_edit.png' :width='22.5' :height='22.5')
          div(@click='$emit("show-top", item)' class='active:opacity-40')
            ImageFC(v-if='item.isShowTop' src='/img/heart.png' :width='22.5' :height='22.5' )
            ImageFC(v-else src='/img/heart_line.png' :width='22.5' :height='22.5')
      div(class='border-l-4 border-stone-400 mt-1')
        a(class='w-full text-textSecond text-gray-700 mt-1 pl-2 py-2 ') {{item.sentenceInput}}
        template(v-if='item.extraTextInputs.length > 0')
          div(class='w-full border-b-2 my-2.5 ml-2' )
        template(v-if='item.extraTextInputs.length > 0')
          div(v-for='(input, index) in item.extraTextInputs' :key='index')
            div(class='pl-2')
              a(class='mr-2 font-medium text-base') {{input.jpValue}}
              a(class='text-textSecond text-gray-500 text-sm') {{input.chValue}}
  div(class='w-full flex justify-center items-center mt-4 mr-6' id='infiniteScrollElement')
  template(v-if='propList.data.length > 0')
    template(v-if='propTotalCount > propList.data.length && propHasMoreData') 
      a(class='font-medium text-lg text-gray-500' ) {{$t('loading')}}
    template(v-else) 
      a(class='font-medium text-lg text-gray-500' ) {{$t('reached_the_bottom')}}
  template(v-if='propList.data.length === 0 && !propInit')
    div(class='w-full flex justify-center items-center mt-8' )
      a(class='font-medium text-xl text-gray-400' ) {{$t('no_more_data')}}
</template>

<script setup>
const { $configUtils } = useNuxtApp();
const localePath = useLocalePath()
defineComponent({})
defineProps({
  propIsTopUP: Boolean,
  propList: Object,
  propHasMoreData: Boolean,
  propInit: Boolean,
  propTotalCount: Number,
})
// $emit 事件
defineEmits([
  'copy-text',
  'show-top',
  'scroll-To'
])
defineExpose({
  localePath
})
</script>