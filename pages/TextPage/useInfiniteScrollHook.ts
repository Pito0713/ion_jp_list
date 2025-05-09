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
	hasMoreData: {value: boolean},
	handleInitSearch: () => void
) {
	//@use hook
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();
	const isTopUP = ref(false); // 是否顯示置頂功能
	const prevHeight = ref(0); // 前一段長度

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
				確保 List.data 無條件捨去個位數後 長度不超過 pageSize * 2 的資料量
				splice() 刪除超過的資料量由開頭 0 到扣掉目前 List.data 長度 pageSize * 2 的多餘資料
				ex: List.data.length = 32 , pageSize.value = 10 
				30(32無條件捨去個位數) > 20
						List.data.splice(0, 32 - 10 * 2) = List.data.splice(0, 12)
			*/

			if (List.data.length > 0) {
				/*
				scrollContainer 取得目前 scrollHeight, 等資料合併後
				nextTick DOM 後 從新拿取 addedHeight 新增合併後 Height

				然後 scrollElements 找出在 container 中的 div 的 Height
				但從 上一筆資料拿到的 prevHeight 往下補足下拉高度到視窗能見曲率
				*/
				const scrollContainer = document.getElementById('scroll-container'); 
				const previousScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;
				List.data =  [...List.data, ...response.data]; // 擴展運算 將兩者合併
				await nextTick(); // 等待 DOM 更新
				const addedHeight = scrollContainer ? scrollContainer.scrollHeight : 0;

				const roundedValue = Math.floor(List.data.length / 10) * 10;
				if (roundedValue > pageSize.value * 2) {
					List.data.splice(0, List.data.length - pageSize.value * 2);
				}
				await nextTick(); // 等待 DOM 更新 

				const scrollElements = document.querySelectorAll("#scroll-container > div");
				let totalHeight = 0;

				scrollElements.forEach((element, index) => {
					if (index > 12) { // 扣除 container 的 置頂 element 從12開始計算
						// 128 是 置頂element
						let target = totalHeight + element.getBoundingClientRect().height + 128
						if (target > window.innerHeight) return // 如果下拉移動的距離大於視窗不進行累積
						totalHeight += element.getBoundingClientRect().height;
					}
				}); 

				// 插入資料後調整滾動條位置
				if (roundedValue > pageSize.value * 2) {
					window.scrollTo({
						// 88 是提高高度讓頁面留畫面出現後續資料 
						top: prevHeight.value - totalHeight + 88,
						behavior: 'auto',
					});
				}
				prevHeight.value = addedHeight - previousScrollHeight
			}
		} else {
			// response status failed clear the list
			List.data = [];
		}
		// 當前頁面可容納的總筆數  若大於 api response 的 totalCount.value
		// condition: 當前頁面筆數大於總比數
		if (currentPageNumber.value * pageSize.value > totalCount.value) hasMoreData.value = false
		// condition: 當前頁面筆數等於總比數
		if (currentPageNumber.value * pageSize.value === totalCount.value) hasMoreData.value = false
		// condition: 當前頁面筆數小於總比數
		if (currentPageNumber.value * pageSize.value < totalCount.value) hasMoreData.value = true
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
				if(response.total > 30) List.data.unshift(...response.data);
				await nextTick(); // 等待 DOM 更新
			}

			/*
				插入 response.data 資料後, 等待 DOM 更新後
				然後 scrollElements 找出在 container 中的 div 的 Height
				但移除掉 置頂的div 開始計算移動高度往後 10 筆資料, 調整滾動條位置
			*/
			if (List.data.length > pageSize.value * 2) {
				List.data.splice(pageSize.value * 2 , List.data.length - pageSize.value*2);
			}
			await nextTick(); // 等待 DOM 更新
			const scrollElements = document.querySelectorAll("#scroll-container > div");
			let totalHeight = 0;
			scrollElements.forEach((element, index) => {
				if (12 > index && index > 1) {
					totalHeight += element.getBoundingClientRect().height;
				}
			}); 


			// 插入資料後調整滾動條位置
			window.scrollTo({
				top: totalHeight,
				behavior: 'auto' ,
			});
		} else {
			// response status failed clear the list
			List.data = [];
		}
		loadingIndicator.finish();
	};

	/* ------- 功能解釋 --------------------------------
	IntersectionObserver - 對於 所指派或指定的 element
		若元素在 viewport 當前視窗時或離開視窗時，會觸發 entries
		inject data {
		isIntersecting 判斷元素是否進入 viewport 視窗範圍
	}*/
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

					if(!init.value && totalCount.value >= currentPageNumber.value * pageSize.value) { 
						// condition: 如果 List 筆數不足 20 觸發 且總筆數不足 20 則不觸發下拉呼叫
						if (20 > List.data.length &&  20 > totalCount.value  && List.data.length > currentPageNumber.value * pageSize.value ) return;
						/*如果這邊是回滾後 再往下拉
					   *會造成前後值資料已存在 會造成重複 這裡進行判斷需 互叫下下筆資料*/
						if (isPrev.value) currentPageNumber.value += 2; // 頁籤 + 2
						else currentPageNumber.value += 1;
						isPrev.value = false; // 是否是回滾狀態 ex: false 下拉狀態
						await searchMoreData();
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
					if(currentPageNumber.value > 1 ) {
						/*如果這邊是下拉後 再往回滾
					   *會造成前後值資料已存在 會造成重複 這裡進行判斷需 互叫下下筆資料*/
						if (!isPrev.value) currentPageNumber.value -= 2; // 頁籤 -2
						else currentPageNumber.value -= 1;
					}
					/* 如果是觸發置頂功能 isCallTopUP , 在window scroll 置頂時重新拿取資料*/
					if (isCallTopUP.value) {
						hasMoreData.value = false;
						handleInitSearch();
						return;
					}
					// condition: 當前若不是初始狀態, 而且總筆數數大於 20 (頁面可容納最大筆數)時 才可再次調用 API 收尋下一筆
					if (!init.value && totalCount.value > 20 && currentPageNumber.value > 0) await searchPrevData();

					isPrev.value = true; // 是否回滾造成的狀態
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
