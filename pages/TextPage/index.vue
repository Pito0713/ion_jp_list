<template lang="pug">
LayoutsPage(class='relative w-full' )
  TextUI_Search(
    v-model:propTextInput="textInput"
    v-model:propSelect="selectOption"
    :propTagArray="tagArray"
    :SELECTIONS='SELECTIONS'
    @select-Tag="handleTag"
    @select-Option="handleOption"
    @init-Search="handleInitSearch"
  )
  TextUI_List(
    :propIsTopUP='isTopUP'
    :propList='List'
    :propHasMoreData='hasMoreData'
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
  handleInitSearch,
  handleTag,
  handleCopy,
  handleShowTop,
  initSearch,
  handleScrollTo
} = useTextHook();

// 無限捲動 Function hook
const {
  searchPrevData,
  searchMoreData
} = useInfiniteScrollHook(textInput, tagArray, currentPageNumber, pageSize, List, isPrev, selectOption);

const infoState = useState('infoState') // 全域狀態 infoState 
const hasMoreData = ref(false) // 是否有更多資料
const isTopUP = ref(false) // 是否顯示置頂功能

onMounted(async () => {
  // 若有info值 導入基礎tag值
  try {
    if (infoState?.value?.info) {
      if (infoState?.value?.info?.tags?.length > 0) {
        tagArray.value = infoState?.value?.info?.tags.map(item => {
          // default value ['verb', 'noun', 'adjective', 'particle']
          return { name: item, active: false }
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

let infiniteScroll = null
let topUp = null
onMounted(async () => {
  try {
    await initSearch()

    /* ------- 功能解釋 --------------------------------
    *  IntersectionObserver - 對於 所指派或指定的 element 
    *  若元素在 viewport 當前視窗時或離開視窗時，會觸發 entries 
    *  inject data {
    *   isIntersecting 判斷元素是否進入 viewport 視窗範圍
    *  }*/

    // element
    const infiniteScrollElement = document.querySelector("#infiniteScrollElement")
    if (infiniteScrollElement) {
      infiniteScroll = new IntersectionObserver(async (entries) => {
        // 底部無限捲動的 div 若進入 viewport 視窗
        if (entries[0].isIntersecting) {
          /* 置頂功能觸發時, 切換資料時會觸發短暫的 infiniteScrollElement 進入視窗內
          這邊做 isCallTopUP 是置頂判斷防止再次觸發無限捲動*/
          if (isCallTopUP.value) {
            isCallTopUP.value = false // 置頂功能關閉
            isTopUP.value = false // 置頂功能隱藏
            return
          }

          /* 如果這邊是回滾後 再往下拉 
          *  會造成前後值資料插在最前端若只+1 會造成重複 這裡進行判斷*/
          if (isPrev.value) currentPageNumber.value += 2 // 頁籤 + 1
          else currentPageNumber.value += 1  // 頁籤 + 1

          /* 當前若不是初始狀態, 而且總筆數數大於 10 時(第一次 call )
          *  才可再次調用 API 收尋下一筆*/
          if (!init.value && totalCount.value > 10) await searchMoreData()

          // 當前頁面可容納的總筆數  若大於 api response 的 totalCount.value
          if (currentPageNumber.value * pageSize.value >= totalCount.value) {
            hasMoreData.value = false; // 沒有更多值
          } else {
            hasMoreData.value = true; // 有更多值
          }
        }
      });
      // 開始監聽 
      infiniteScroll.observe(infiniteScrollElement);
    }

    // element
    const topUpElement = document.querySelector("#topUpElement")
    if (topUpElement) {
      topUp = new IntersectionObserver(async (entries) => {
        // 若元素離開 viewport 當前視窗時，顯示置頂功能
        if (!entries[0].isIntersecting) {
          isTopUP.value = true
        } else {
          if (currentPageNumber.value === 1) return
          if (currentPageNumber.value > 1) currentPageNumber.value -= 1 // 頁籤 + 1
          /* 如果是觸發置頂功能 isCallTopUP , 在window scroll 置頂時重新拿取資料*/
          if (isCallTopUP.value) {
            handleInitSearch()
            return
          }
          if (!init.value && totalCount.value > 10) await searchPrevData()
          /* 當前若不是初始狀態, 而且總筆數數大於 10 時(第一次 call )
          // 才可再次調用 API 收尋下一筆*/
          isTopUP.value = false
        }
      });
      // 監聽
      topUp.observe(topUpElement);
    }
  } catch (err) {
    console.error("Failed to fetch text:", err)
  }
})

onBeforeUnmount(() => {
  // 解除 IntersectionObserver 監聽事件
  infiniteScroll.disconnect()
  topUp.disconnect()
  infiniteScroll = null; // 設為 null 防止內存洩漏
  topUp = null; // 設為 null 防止內存洩漏
})

defineComponent({
  components: { LayoutsPage, TextUI_Search, TextUI_List },
})
defineExpose({
  SELECTIONS,
  handleTag,
  handleCopy,
  handleShowTop,
  handleScrollTo
})

</script>