<template lang="pug">
  Card(class='custom-container flex-col mt-3 fixed top-12 left-15 z-40 rounded-none')
    div(class='flex flex-row w-full' )
      div(class='flex border-2 border-primary-color rounded-md justify-between w-32 flex-1')
        input(
          :placeholder="$t('please_enter_word')" 
          :value="propTextInput"  
          class=" border-none outline-none w-32 flex-1"
          @input="$emit('update:propTextInput', $event.target.value)"
        )
        div(@click='$emit("init-input")')
          ImageFC(src='/img/one_click.png' :width='40' :height='40')
      LoadingBN(
        :text="'search'"
        class='w-18 flex-3'
        :customClass="'mx-2 px-5'"
        @click='$emit("init-Search")'
      )
    div(class='flex w-full justify-between')
      div(class='flex')
        template(v-for='(item, index) in propTagArray' :key='item')
          Tag(@click='$emit("select-Tag", index)' :class='item.active && "bg-primary-color text-white"')
            a(class='text-xs md:text-base' :class='item.active && "bg-primary-color text-white"') {{$t(item.name)}}
      select(
        name='sort' 
        id='sort'
        :value='propSelect'
        class='flex border-2 w-30 rounded mt-2 mr-2 pl-1' 
        @change="$emit('update:propSelect', $event.target.value)"
      )
        option(v-for="item in SELECTIONS" :key="item.id" :value="item.name") {{ $t(item.name) }}    
  </template>

<script setup>
// @props
defineProps({
  propTextInput: String,
  propTagArray: Array,
  propSelect: String,
  SELECTIONS: Array,
})
// $emit 事件
defineEmits([
  'init-Search',
  'select-Tag',
  'init-input',
  'update:propTextInput',
  'update:propSelect'
])
</script>