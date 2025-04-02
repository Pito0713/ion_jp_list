<template lang="pug">
LayoutsPage(class='relative w-full' )
  TextUI_Search(
    v-model:propTextInput="textInput"
    v-model:propSelect="selectOption"
    :propTagArray="tagArray"
    :SELECTIONS='SELECTIONS'
    @select-Tag="handleTag"
    @init-Search="handleInitSearch"
    @init-input="initInput"
  )
  TextUI_List(
    :propIsTopUP='isTopUP'
    :propList='List'
    :propHasMoreData='hasMoreData'
    :propInit='init'
    :propTotalCount='totalCount'
    @scroll-To='handleScrollTo'
    @copy-text="handleCopy"
    @show-top="handleShowTop"
  )
</template>

<script setup>
// @自定義 hook
import { useTextHook } from './useTextHook'
import { useInfiniteScrollHook } from './useInfiniteScrollHook'
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import TextUI_Search from './TextUI_Search.vue'
import TextUI_List from './TextUI_List.vue'
import { SELECTIONS } from './config'

// 解構 useTextHook 
const {
  init,
  textInput,
  tagArray,
  List,
  isCallTopUP,
  isPrev,
  currentPageNumber,
  pageSize,
  totalCount,
  selectOption,
  hasMoreData,
  handleInitSearch,
  handleTag,
  handleCopy,
  handleShowTop,
  initSearch,
  handleScrollTo,
  initInput
} = useTextHook();

// 解構 無限捲動 useInfiniteScrollHook
const {
  isTopUP,
  infiniteScrollObserve,
  topUpObserve,
} = useInfiniteScrollHook(
  textInput,
  tagArray,
  currentPageNumber,
  pageSize,
  List,
  isPrev,
  selectOption,
  isCallTopUP,
  totalCount,
  init,
  hasMoreData,
  handleInitSearch
);

let infiniteScroll = null
let topUp = null
onMounted(async () => {
  try {
    await initSearch()
    infiniteScroll = infiniteScrollObserve(infiniteScroll)
    topUp = topUpObserve(topUp)
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

onBeforeUnmount(async () => {
  // 解除 IntersectionObserver 監聽事件
  await infiniteScroll.disconnect()
  await topUp.disconnect()
  infiniteScroll = null; // 設為 null 防止內存洩漏
  topUp = null; // 設為 null 防止內存洩漏
})

defineComponent({
  components: { LayoutsPage, TextUI_Search, TextUI_List },
})
defineExpose({
  isTopUP,
  hasMoreData,
  SELECTIONS,
  handleTag,
  handleCopy,
  handleShowTop,
  handleScrollTo
})

</script>