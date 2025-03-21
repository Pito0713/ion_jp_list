import {ref} from 'vue';
import {useNuxtApp} from '#app';

export function useHomeHook() {
	// ----- State
	const question = ref<{
		_id?: string;
		questionTagArray?: any[];
		questionA?: string;
		questionB?: string;
	}>({}); // 題目
	const answer = ref(''); // 答案
	const selectedAnswerId = ref(''); // 答案 object id
	const isSubmit = ref(false); // 提交按鈕 for disabled
	const loading = ref(false); // 載入中
	const isEmptyData = ref(false); // 載入中
	const homeList = reactive({
		data: {},
	}); // for api responses data

	// ----- use hook config
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @timeRange
	const now = new Date();
	const tomorrow = new Date(now).setHours(24, 0, 0, 0); // 設定到今天 23:59:59
	const untilSecondsDay = Math.floor((new Date(tomorrow).getTime() - now.getTime()) / 1000);

	// update answer
	const handleAnswer = (_value: {
		_id: string;
		file: string;
	}) => {
		if (!isSubmit.value) {
			answer.value = _value.file;
			selectedAnswerId.value = _value._id;
		}
	};

	// @Api answerQuiz /提交答題資料
	const handleSubmit = async () => {
		loadingIndicator.start();
		let submitData = {
			_id: question.value._id, // 題目的 object id
			file: answer.value, // 使用者提交的答案
			extraId: JSON.stringify(question.value.questionTagArray), // 全部選項 id
		};
		let res = await $api.answerQuiz(submitData);

		// success
		if (res.status === 1) {
			// 引用 Pinia 全域值 modalStore
			const store = modalStore();
			store.ModalShow(res.message, 'success'); // 公用彈窗導入

			// assign res.data
			const correctAnswerFile = res.data.correctAnswer; // 正確答案
			const fileAnswerTranslation = res.data.answerFile; // 各個選項的翻譯資料

			/*question 答題資料進行 reset
				當提交回答問題後, 由 api 提供的各個選項資料進行重組
        補上 各個選項資料的 平假 與 翻譯
        邏輯: 
        1. forEach 資料 find id
        2. 若對應 id reset 並將平假和翻譯 ex: 若い (わかい) 年輕的 
        3. correct answer to (O) , error answer to (X)
      */
			question.value.questionTagArray?.forEach((item, index) => {
				let target = question.value.questionTagArray
					? question.value.questionTagArray[index]
					: null;
				let targetTranslation = fileAnswerTranslation.find((e: any) => {
					return target?._id === e._id;
				}); // 找到對應 api 回傳選項翻譯資料
				// reset to new file ex: 若い (わかい) 年輕的
				let resetAnswerFile = `${targetTranslation.file}     ${targetTranslation?.fileHiragana ? `(${targetTranslation?.fileHiragana})` : ''} ${targetTranslation?.fileTranslate || ''} `;

				if (item.file == correctAnswerFile.file) {
					target.file = resetAnswerFile + ` (O)`; // 正確的
					target.correct = true;
				} else target.file = resetAnswerFile + ` (X)`; // 錯誤的
			});

			// @Cookies untilSecondsDay: 限制只到12點
			let dailyText = useCookie('dailyText', {maxAge: untilSecondsDay});

			if (!dailyText.value) dailyText.value = JSON.stringify([correctAnswerFile._id]);
			else {
				let dailyArray = JSON.parse(JSON.stringify(dailyText.value)); // 解析
				// unshift() 方法會添加一個或多個元素至陣列的開頭，並且回傳陣列的新長度。
				dailyArray.unshift(correctAnswerFile._id);
				dailyText.value = JSON.stringify(dailyArray);
			}

			await nextTick(); // 等待 DOM 更新
			answerDaily(); // 更新每日回答題目

			isSubmit.value = true; // 提交按鈕 disabled
		}
		loadingIndicator.finish();
	};

	// 每日測驗題目
	const answerDaily = async () => {
		let dailyText = useCookie('dailyText', {maxAge: untilSecondsDay})?.value;
		if (dailyText) {
			let res = await $api.answerDaily({
				selectId: JSON.stringify(dailyText),
			});
			homeList.data = res.data;
		}
	};

	// 更換問題題目
	const changeTextQuiz = async () => {
		answer.value = '';
		await callTextQuiz(); // 重新呼叫資料
	};

	// @Api textQuiz 測驗題目
	const callTextQuiz = async () => {
		loadingIndicator.start();
		loading.value = true; // 載入中
		let target = await $api.textQuiz();

		// success
		if (!target.data) return isEmptyData.value = true;
		if (target.status === 1 && target.data) {
			isEmptyData.value = false;
			isSubmit.value = false; // question 初始化 提交按鈕關閉
			let str = target.data.question;

			/*
        整理理問題框內容, 若問題框有 () 將 () 分割
        按照 ( ) 前後將句子分成兩段
        邏輯: 
        1. indexOf() indexOfPart 查找若是否 () 
        2. 若有 indexOfPart > 1 問題框有進行 split 分割 A B 段
        3. 若有 indexOfPart === 0 為第一筆直接 (
        4. 如果都沒有 回傳 -1 , 直接回傳整段
        ex: 若い()人  -> partA: 若い( ,   partB: )人
      */
			const indexOfPart = str.indexOf('()');
			let partA = null;
			let partB = null;
			if (indexOfPart > -1) {
				// indexOf 沒有值回傳 -1
				partA = str.split('(')[0] + ` (`; // 以 ( 判斷為前段 A
				partB = `) ` + str.split(')')[1]; // 以 ) 判斷為後段 B
				if (indexOfPart === 0) partA = ` (`; // 如果( 是在第一個位置 直接回傳 (
			} else {
				partA = target.data.question;
			}

			// assignment values
			question.value = {
				_id: target.data._id,
				questionA: partA,
				questionB: partB ? partB : '', // 若問題中沒有 )直接回傳 空值
				questionTagArray: target.data.randomTagTestArray,
			};
		}
		loading.value = false;
		loadingIndicator.finish();
	};
	// 引用 Pinia 全域值 modalStore
	const store = modalStore();
	/*handleCopy 透過 navigator.clipboard 舊瀏覽器可能不支援
    會返回 promise 若 error 進入 catch, 成功進入 resolved 
		不需使用 resolved 狀態, 直接用 await 代替*/
	const handleCopy = async (_text: string) => {
		try {
			await navigator.clipboard.writeText(_text);
			store.ModalShow('success_copy'); // 彈窗文字
		} catch (err) {
			store.ModalShow('fall_copy'); // 彈窗文字
			console.error('fall_copy:', err);
		}
	};

	// @Api editTextShowTop 更新是否置頂
	const showTop = async (item: {_id: string; isShowTop: boolean}) => {
		let submitData = {
			_id: item._id, // _id of object
			isShowTop: !item.isShowTop, // 是否置頂
		};

		const response = await $api.editTextShowTop(submitData);
		// success
		if (response.status === 1) {
			await answerDaily();
		}
	};

	return {
		question,
		answer,
		selectedAnswerId,
		homeList,
		isSubmit,
		loading,
		isEmptyData,
		handleAnswer,
		handleSubmit,
		changeTextQuiz,
		callTextQuiz,
		handleCopy,
		showTop,
		answerDaily,
	};
}
