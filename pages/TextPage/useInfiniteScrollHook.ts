interface Tag {
	name: string;
	active: false;
}
interface List {
	data: any[];
}

export function useInfiniteScrollHook(
	textInput: {value: string},
	tagArray: {value: Tag[]}, // interface ts
	currentPageNumber: {value: number},
	pageSize: {value: number},
	List: List, // interface ts
	isPrev: {value: boolean},
	selectOption: {value: string},
	isCallTopUP: {value: boolean},
	totalCount: {value: number},
	init: {value: boolean},
	handleInitSearch: () => void
) {
	//@use hook
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();
	const isTopUP = ref(false); // 是否顯示置頂功能
	const hasMoreData = ref(false); // 是否有更多資料

	// @api /searchText  下拉更多搜尋
	const searchMoreData = async () => {
		loadingIndicator.start();
		let submitData = {
			searchValue: textInput.value,
			tags: tagArray.value.filter((item) => item.active).map((item) => item.name), // 選擇篩選出有激活啟用的 tag 詞語資料
			pageNumber: currentPageNumber.value,
			pageSize: pageSize.value,
			sortValue: selectOption.value,
		};

		const response = await $api.searchText(submitData);
		// success
		if (response.status === 1) {
			/*      
				後續 由頁面載入觸發或 infinite Scroll 捲動觸發 searchMoreData
				先判斷 List.data 是否有資料
				若 List.data 有值, 將 response data 與 List.data 兩者進行擴展合併,
				確保 List.data 長度不超過 pageSize * 2 的資料量
				splice() 刪除超過的資料量由開頭 0 到扣掉目前 List.data 長度 pageSize * 2 的多餘資料
				ex: List.data.length = 30 , pageSize.value = 10
						List.data.splice(0, 30 - 10 * 2) = List.data.splice(0, 10)
			*/

			if (List.data.length > 0) {
				List.data = [...List.data, ...response.data]; // 擴展運算 將兩者合併
				if (List.data.length > pageSize.value * 2) {
					List.data.splice(0, List.data.length - pageSize.value * 2);
				}
			}
		} else {
			// response status failed clear the list
			List.data = [];
		}

		isPrev.value = false; // 是否回滾造成的狀態
		loadingIndicator.finish();
	};

	// @api /searchText  上拉更多搜尋
	const searchPrevData = async () => {
		loadingIndicator.start(); // loading 條觸發
		let submitData = {
			searchValue: textInput.value,
			tags: tagArray.value.filter((item) => item.active).map((item) => item.name), // 選擇篩選出有激活啟用的 tag 詞語資料
			pageNumber: currentPageNumber.value,
			pageSize: pageSize.value,
			sortValue: selectOption.value,
		};

		const response = await $api.searchText(submitData);
		// success
		if (response.status === 1) {
			if (List.data.length > 0) {
				// unshift() 方法會添加一個或多個元素至陣列的開頭，並且回傳陣列的新長度。
				List.data.unshift(...response.data);
				await nextTick(); // 等待 DOM 更新
			}

			/*
				插入 response.data 資料後, 等待 DOM 更新後
				previousScrollHeight 這邊為插入 response.data 資料後的 scrollHeight
				然後再次刪除多餘的資料量 確保 List.data 長度不超過 pageSize * 2 的資料量
				-- 在等待 DOM 更新後 --
				在宣告一個 addedHeight 這邊為刪除多餘的資料量後的 scrollHeight
				因為是 unshift() 方法, 所以插入資料後會在最上方,
				所以 previousScrollHeight - addedHeight 這裏為 response.data 插入資料後的高度差
				然後 window.scrollTo 調整滾動條位置,  
			*/
			const scrollContainer = document.getElementById('scroll-container');
			const previousScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;
			if (List.data.length > pageSize.value * 2) {
				List.data.splice(pageSize.value * 2, pageSize.value);
			}
			await nextTick(); // 等待 DOM 更新
			const addedHeight = scrollContainer ? scrollContainer.scrollHeight : 0;

			// 插入資料後調整滾動條位置
			window.scrollTo({
				top: previousScrollHeight - addedHeight,
				behavior: 'auto',
			});
		} else {
			// response status failed clear the list
			List.data = [];
		}

		isPrev.value = true; // 是否回滾造成的狀態
		loadingIndicator.finish();
	};

	/* ------- 功能解釋 --------------------------------
	 *  IntersectionObserver - 對於 所指派或指定的 element
	 *  若元素在 viewport 當前視窗時或離開視窗時，會觸發 entries
	 *  inject data {
	 *   isIntersecting 判斷元素是否進入 viewport 視窗範圍
	 *  }*/
	const infiniteScrollObserve = (infiniteScroll: IntersectionObserver | null) => {
		// element
		const infiniteScrollElement = document.querySelector('#infiniteScrollElement');
		if (infiniteScrollElement) {
			infiniteScroll = new IntersectionObserver(async (entries) => {
				// 底部無限捲動的 div 若進入 viewport 視窗
				if (entries[0].isIntersecting) {
					/* 置頂功能觸發時, 切換資料時會觸發短暫的 infiniteScrollElement 進入視窗內
          這邊做 isCallTopUP 是置頂判斷防止再次觸發無限捲動*/
					if (isCallTopUP.value) {
						isCallTopUP.value = false; // 置頂功能關閉
						isTopUP.value = false; // 置頂功能隱藏
						return;
					}

					/* 如果這邊是回滾後 再往下拉
					 *  會造成前後值資料插在最前端若只+1 會造成重複 這裡進行判斷*/
					if (isPrev.value)
						currentPageNumber.value += 2; // 頁籤 + 1
					else currentPageNumber.value += 1; // 頁籤 + 1

					/* 當前若不是初始狀態, 而且總筆數數大於 10 時(第一次 call )
					 *  才可再次調用 API 收尋下一筆*/
					if (!init.value && totalCount.value > 10) {
						await searchMoreData();
						// 當前頁面可容納的總筆數  若大於 api response 的 totalCount.value
						if (currentPageNumber.value * pageSize.value >= totalCount.value) {
							hasMoreData.value = true; // 有更多值
						} else {
							hasMoreData.value = false; // 沒有更多值
						}
					}
				}
			});
			// 開始監聽
			infiniteScroll.observe(infiniteScrollElement);
			return infiniteScroll;
		}
	};
	const topUpObserve = (topUp: IntersectionObserver | null) => {
		// element
		const topUpElement = document.querySelector('#topUpElement');
		if (topUpElement) {
			topUp = new IntersectionObserver(async (entries) => {
				// 若元素離開 viewport 當前視窗時，顯示置頂功能
				if (!entries[0].isIntersecting) {
					isTopUP.value = true;
				} else {
					isTopUP.value = false;
					if (currentPageNumber.value === 1) return;
					if (currentPageNumber.value > 1) currentPageNumber.value -= 1; // 頁籤 + 1
					/* 如果是觸發置頂功能 isCallTopUP , 在window scroll 置頂時重新拿取資料*/
					if (isCallTopUP.value) {
						hasMoreData.value = false;
						handleInitSearch();
						return;
					}
					if (!init.value && totalCount.value > 10) await searchPrevData();
					/*當前若不是初始狀態, 而且總筆數數大於 10 時(第一次 call )
            才可再次調用 API 收尋下一筆*/
				}
			});
			// 監聽
			topUp.observe(topUpElement);
			return topUp;
		}
	};

	return {
		hasMoreData,
		isTopUP,
		infiniteScrollObserve,
		topUpObserve,
		searchPrevData,
		searchMoreData,
	};
}
