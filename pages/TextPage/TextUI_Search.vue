<template lang="pug">
Card(class='custom-container flex-col mt-3 fixed top-14 left-15 z-40')
  div(class='flex flex-row w-full' )
    input(
      :placeholder="$t('please_enter_word')" 
      :value="propTextInput"  
      class="flex-1"
      @input="$emit('update:propTextInput', $event.target.value)"
    )
    button(class='mx-2 px-5 flex-6' @click='$emit("init-Search")') {{$t('search')}}
  div(class='flex w-full' )
    template(v-for='(item, index) in propTagArray' :key='item')
      Tag(@click='$emit("select-Tag", index)' :class='item.active && "bg-primary-color text-white"')
        a(:class='item.active && "bg-primary-color text-white"') {{$t(item.name)}}
</template>

<script setup>
// @props
defineProps({
  propTextInput: String,
  propTagArray: Array,
})
// $emit 事件
defineEmits([
  'init-Search',
  'select-Tag',
  'update:propTextInput'
])
</script>