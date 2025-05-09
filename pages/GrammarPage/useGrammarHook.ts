import {ref, reactive} from 'vue';
export function useGrammarHook() {
	// @statements
	const init = ref(true); // 觸發 頁面初始化狀態與否
	const textInput = ref('');
	const List = reactive<{data: any[]}>({
		data: [],
	}); // for api responses data

	// @variables for scroll
	const currentPageNumber = ref(1); // 當前頁面, 默認起始 1
	const pageSize = ref(10); // 頁面筆數, 默認 10 筆為一單位
	const totalCount = ref(0); // 資料總筆數
	const isCallTopUP = ref(false); // 是否觸發置頂功能
	const isPrev = ref(false); // 是否回滾觸發上一頁功能
	const hasMoreData = ref(false); // 是否有更多資料

	// @use hook
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @api /searchGrammar  初始化搜尋
	const initSearch = async () => {
		loadingIndicator.start();
		let submitData = {
			searchValue: textInput.value,
			pageNumber: currentPageNumber.value,
			pageSize: pageSize.value,
		};

		const response = await $api.searchGrammar(submitData);
		// success
		if (response.status === 1) {
			/* initSearch 所觸發的 init 初始化頁面
			/  response data 賦值到 List data 覆蓋前值資料*/
			List.data = response.data;
			totalCount.value = response.total;
			if (totalCount.value > 10) hasMoreData.value = true
		} else {
			// response status failed clear the list
			List.data = [];
		}

		init.value = false; // call api 完成後,  結束初始化狀態
		loadingIndicator.finish();
	};

	// 頁面初始化
	/* 初始化啟動, 當前頁籤重置, 
	/  總筆數重置 list data 清空*/
	const initReset = () => {
		init.value = true;
		currentPageNumber.value = 1;
		totalCount.value = 0;
		List.data = [];
		isPrev.value = false;
		hasMoreData.value = false;
	};

	// 觸發頁面初始化
	const handleInitSearch = async () => {
		initReset();
		await initSearch();
	};

	// @api /editGrammarShowTop  文法是否置頂
	const handleShowTop = async (item: {_id: string; isShowTop: boolean}) => {
		loadingIndicator.start();
		let submitData = {
			_id: item._id, // _id of the item
			isShowTop: !item.isShowTop, // 是否置頂
		};

		const response = await $api.editGrammarShowTop(submitData);
		// success
		if (response.status === 1) {
			await handleInitSearch(); // 觸發頁面初始化
		}
		loadingIndicator.finish(); // loading 條完成
	};

	/*
	引用 Pinia 全域值 modalStore
  handleCopy 透過 navigator.clipboard 舊瀏覽器可能不支援
  會返回 promise 若 error 進入 catch, 成功進入 resolved 
  不需使用 resolved 狀態, 直接用 await 代替
	*/
	const store = modalStore(); // 公用彈窗導入
	const handleCopy = async (_text: string) => {
		try {
			await navigator.clipboard.writeText(_text);
			store.ModalShow('success_copy', 'copy_color') // 彈窗文字
		} catch (err) {
			store.ModalShow('fall_copy'); // 彈窗文字
			console.error('fall_copy:', err);
		}
	};

	// 觸發捲動置頂功能
	const handleScrollTo = () => {
		isCallTopUP.value = true; // 觸發置頂功能
		window.scrollTo({
			top: 0,
			behavior: 'smooth', // 平滑的捲動狀態
		});
	};

	// 觸發清除輸入筐
	const initInput = () => {
		textInput.value = '';
	};

	return {
		init,
		textInput,
		List,
		currentPageNumber,
		pageSize,
		totalCount,
		isCallTopUP,
		isPrev,
		hasMoreData,
		initSearch,
		handleShowTop,
		handleInitSearch,
		handleCopy,
		handleScrollTo,
		initInput,
	};
}
