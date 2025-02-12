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
	isPrev: {value: boolean}
) {
	//@use hook
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @api /searchText  下拉更多搜尋
	const searchMoreData = async () => {
		loadingIndicator.start();
		let submitData = {
			searchValue: textInput.value,
			tags: tagArray.value.filter((item) => item.active).map((item) => item.name), // 選擇篩選出有激活啟用的 tag 詞語資料
			pageNumber: currentPageNumber.value,
			pageSize: pageSize.value,
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

	return {
		searchPrevData,
		searchMoreData,
	};
}
