<template lang="pug">
  div(class='relative flex justify-center items-center flex-col pb-16' id='scroll-container')
    div(class='w-full flex h-28 mb-2' id='topUpElement')
    div(v-if='propIsTopUP' class='fixed w-10 h-10 bottom-20 right-6 md:right-1/2 md:translate-x-72' @click='$emit("scroll-To")')
      ImageFC(src='/img/topup_arrow.png' :width='35' :height='20')
    div(class='fixed w-12 h-12 bottom-4 right-6 md:right-1/2 md:translate-x-72')
      NuxtLinkLocale(to="AddTextPage")
        ImageFC(src='/img/add_text_circle.png' :width='50' :height='50')
    template(v-for='(item, index) in propList.data' :key='item._id')
      Card(class='w-full my-1 flex-col' )
        div(class='w-full ml-1')
          template(v-if='item.tags.length > 0')
            div(class='flex flex-row')
              template(v-for='(item, index) in item.tags' :key='item')
                a(class='mr-2 mb-1 text-gray-400 text-sm') {{$t(item)}}
        div(class='w-full flex flex-row')
          div(class='w-9/12 flex flex-row justify-start items-center mb-1')
            a(class=' text-2xl font-medium mr-2 ml-1') {{item.file}}
            a(v-if='item.fileHiragana' class=' text-gray-500 text-xs font-medium mr-1 mt-3 ') {{item.fileHiragana}}
            a(v-if='item.fileTranslate' class=' text-base font-medium ml-3 mr-1 mt-2 ') {{item.fileTranslate}}
            div(@click='$emit("copy-text",item.file)'  class='active:opacity-20 mt-2')
              ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
          div(class='w-3/12 flex flex-row justify-end items-center')
            NuxtLink(:to="{ path:localePath('EditTextPage'), query: { value: $configUtils.encodeBase64(item) } }" class='mr-3')
              ImageFC(src='/img/item_edit.png' :width='22.5' :height='22.5')
            div(@click='$emit("show-top", item)' class='active:opacity-40')
              ImageFC(v-if='item.isShowTop' src='/img/heart.png' :width='22.5' :height='22.5' )
              ImageFC(v-else src='/img/heart_line.png' :width='22.5' :height='22.5')
        div(class='border-l-4 border-stone-400')
          div(class='bg-stone-100 p-2 flex justify-center items-starts flex-col')
            a(class='text-textSecond text-gray-700 text-lg') {{item.translation}}
            template(v-if='item.inputs.length > 0')
              div(class='border-b-2 border-stone-200 my-1' )
            template(v-if='item.inputs.length > 0' class='mt-2' )
              div(v-for='(input, index) in item.inputs' :key='index')
                div(class='h-6')
                  a(class='mr-2 font-medium text-sm') {{input.jpValue}}
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
// @router fit i18
const localePath = useLocalePath()
// @props
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