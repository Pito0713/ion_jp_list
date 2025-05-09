<template lang="pug">
LayoutsPage(class='')
  GrammarUI_Search(
    v-model:propTextInput="textInput"
    @init-Search="handleInitSearch"
    @init-input="initInput"
  )
  GrammarUI_List(
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
// @自定義 UI
import LayoutsPage from '../../layouts/LayoutsPage.vue'
import GrammarUI_List from './GrammarUI_List.vue'
import GrammarUI_Search from './GrammarUI_Search'
// @自定義 Hook
import { useGrammarHook } from './useGrammarHook'
import { useInfiniteScrollHook } from './useInfiniteScrollHook'

// 解構 useGrammarHook 
const {
  init,
  textInput,
  List,
  isCallTopUP,
  isPrev,
  currentPageNumber,
  pageSize,
  totalCount,
  hasMoreData,
  handleInitSearch,
  handleCopy,
  handleShowTop,
  initSearch,
  handleScrollTo,
  initInput
} = useGrammarHook()

// 解構 無限捲動 useInfiniteScrollHook
const {
  isTopUP,
  infiniteScrollObserve,
  topUpObserve,
} = useInfiniteScrollHook(
  textInput,
  currentPageNumber,
  pageSize,
  List,
  isPrev,
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

onBeforeUnmount(() => {
  try {
    // 解除 IntersectionObserver 監聽事件
    if (infiniteScroll) infiniteScroll.disconnect()
    if (topUp) topUp.disconnect()
  } catch (error) {
    console.error('Error during beforeUnmount:', error)
  } finally {
    infiniteScroll = null; // 設為 null 防止內存洩漏
    topUp = null; // 設為 null 防止內存洩漏
  }
})

defineExpose({
  isTopUP,
  hasMoreData,
  handleCopy,
  handleShowTop,
  handleScrollTo,
  initInput
})


defineComponent({
  components: { LayoutsPage, GrammarUI_List, GrammarUI_Search },
})

</script>