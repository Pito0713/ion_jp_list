<template lang="pug">
  div
    template(v-if='homeList.data.length > 0')
      div(class='mt-3 mx-2 text-xl font-medium')
        a {{$t('daily_quiz')}} {{`(${homeList.data?.length})`}}
    template(v-for='(item, index) in homeList.data' :key='item._id')
      Card(class='w-full my-1 flex-col p-1' )
        div(v-if='item.type === "text"' class='w-full')
          template(v-if='item.tags?.length > 0')
            div(class='flex flex-row')
              template(v-for='(item, index) in item.tags' :key='item')
                a(class='mr-2 mb-1 text-gray-400 text-xs') {{$t(item)}}
        div(v-if='item.type === "grammar"' class='w-full')
          div(class='flex flex-row')
            a(class='mr-2 mb-1 text-gray-400 text-xs') {{$t('grammar')}}
        div(class='w-full flex flex-row ')
          div(class='w-9/12 flex flex-row justify-start items-center mb-1')
            a(class=' text-base font-medium mr-2 ') {{item.type === 'text' ? item.file : item.grammarInput}}
            a(v-if='item?.fileHiragana' class=' text-gray-500 text-xs font-medium mr-1 mt-1') {{item.fileHiragana}}
            a(v-if='item?.fileTranslate || item.grammarTransInput' class=' text-sm font-medium ml-3 mr-1 mt-1') {{item.type === 'text' ? item.fileTranslate : item.grammarTransInput}}
            div(v-if='item.file' @click='$emit("handle-copy",item.file)' class='active:opacity-20 ml-2 mt-1')
              ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
            div(v-if='item.grammarInput' @click='$emit("handle-copy",item.grammarInput)' class='active:opacity-20 ml-2 mt-1')
              ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
          div(class='w-3/12 flex flex-row justify-end items-center')
            div(v-if='item.type === "text"' @click='$emit("showText-top",item)' class='active:opacity-40')
              ImageFC(v-if='item.isShowTop' src='/img/heart.png' :width='20.5' :height='20.5' )
              ImageFC(v-else src='/img/heart_line.png' :width='20.5' :height='20.5')
            div(v-if='item.type === "grammar"' @click='$emit("showGrammar-top",item)' class='active:opacity-40')
              ImageFC(v-if='item.isShowTop' src='/img/heart.png' :width='20.5' :height='20.5' )
              ImageFC(v-else src='/img/heart_line.png' :width='20.5' :height='20.5')
        div(class='w-full flex flex-row ')
          a(class='text-textSecond text-gray-500 text-sm') {{item.type === 'text' ? item.translation : item.sentenceInput}}
          div(v-if='item?.translation' @click='$emit("handle-copy",item.translation)' class='active:opacity-20 ml-2 mt-1')
            ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
          div(v-if='item?.sentenceInput' @click='$emit("handle-copy",item.sentenceInput)' class='active:opacity-20 ml-2 mt-1')
            ImageFC(src='/img/item_copy.png' :width='16' :height='16' )
  </template>

<script setup>
defineProps({
  homeList: Object,
})
defineEmits(['handle-copy', 'show-top'])
</script>