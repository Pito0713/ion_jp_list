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
      :customClass="'mx-2 px-5 flex-6'"
      @click='$emit("init-Search")'
    )
</template>

<script setup>
// @props
defineProps({
  propTextInput: String,
})
// $emit 事件
defineEmits([
  'init-Search',
  'update:propTextInput',
  'init-input',
])
</script>