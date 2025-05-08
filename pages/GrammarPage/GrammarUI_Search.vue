<template lang="pug">
Card(class='custom-container flex-col mt-3 fixed top-14 left-15 z-40')
  div(class='flex flex-row w-full' )
    input(
      :placeholder="$t('please_enter_word')" 
      :value="propTextInput"  
      class="flex-1"
      @input="$emit('update:propTextInput', $event.target.value)"
    )
    LoadingBN(
      :text="'search'"
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
])
</script>