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
	const isSubmit = ref(false); // 提交按鈕 for disabled
	const loading = ref(false); // 載入中

	// ----- use hook config
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	const handleAnswer = (_value: string) => {
		/* @props : {
      _value: string
    }*/
		if (!isSubmit.value) answer.value = _value;
	};

	// @Api answerTest api 提交答題資料
	const handleSubmit = async () => {
		loadingIndicator.start(); // start loading
		let submitData = {
			_id: question.value._id, // 題目的 object id
			file: answer.value, // 使用者提交的答案
			extraId: JSON.stringify(question.value.questionTagArray), // 全部選項 id
		};
		let res = await $api.answerTest(submitData);

		// success
		if (res.status === 1) {
			// 引用 Pinia 全域值 modalStore
			const store = modalStore();
			store.ModalShow(res.message, 'success'); // 公用彈窗導入

			// assign res.data
			const correctAnswerFile = res.data.correctAnswer.file; // 正確答案
			const fileAnswerTranslation = res.data.answerFile; // 各個選項的翻譯資料

			/*
        question 答題資料進行 reset
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
				// reset to new file
				// ex: 若い (わかい) 年輕的
				let resetAnswerFile = `${targetTranslation.file}     ${targetTranslation?.fileHiragana ? `(${targetTranslation?.fileHiragana})` : ''} ${targetTranslation?.fileTranslate || ''} `;

				if (item.file == correctAnswerFile) {
					target.file = resetAnswerFile + ` (O)`; // 正確的
					target.correct = true;
				} // 正確的
				else target.file = resetAnswerFile + ` (X)`; // 錯誤的
			});
			isSubmit.value = true; // 提交按鈕 disabled
		}
		loadingIndicator.finish();
	};

	// 更換問題題目
	const changeTextTest = async () => {
		answer.value = '';
		await callTextTest(); // 重新呼叫資料
	};

	// @Api textTest api
	const callTextTest = async () => {
		loading.value = true; // ��入中
		let target = await $api.textTest();

		// success
		if (target.status === 1) {
			isSubmit.value = false; // question 初始化 提交按鈕關閉
			loading.value = false; // 載入中
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
	};

	return {
		question,
		answer,
		isSubmit,
		loading,
		handleAnswer,
		handleSubmit,
		changeTextTest,
		callTextTest,
	};
}
