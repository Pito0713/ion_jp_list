import {ref, reactive} from 'vue';
export function useAddGrammarHook() {
	// @use hook
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @Statements
	const grammarInput = ref(null);
	const grammarTransInput = ref(null);
	const sentenceInput = ref(null);
	const extraTextInputs = ref<{jpValue: string; chValue: string}[]>([]);
	const isSubmit = ref(false); // 提交按鈕 avoid 重複點擊

	// @router fit i18
	const router = useRouter();
	const localePath = useLocalePath();

	// 新增補充單字
	const handleAddInput = () => {
		extraTextInputs.value.push({jpValue: '', chValue: ''});
	};

	// 移除對應 input 資料
	const handleRemoveInput = (_index: number) => {
		extraTextInputs.value.splice(_index, 1);
	};

	// @api /addGrammar  新增文法
	const onSubmit = async () => {
		loadingIndicator.start();
		isSubmit.value = true; // button loading disabled
		let submitData = {
			grammarInput: grammarInput.value ?? '', // <String | undefined>
			grammarTransInput: grammarTransInput.value ?? '', // <String | undefined>
			sentenceInput: sentenceInput.value ?? '', // <String | undefined>
			extraTextInputs: JSON.stringify(extraTextInputs.value), // type Array turn type String for mongodb
		};
		let target = await $api.addGrammar(submitData);
		// success
		if (target?.status === 1) {
			// localePath for i18 translate
			router.push(localePath('/GrammarPage'));
		}
		isSubmit.value = false; // button loading disabled
		loadingIndicator.finish();
	};

	return {
		grammarInput,
		grammarTransInput,
		sentenceInput,
		extraTextInputs,
		onSubmit,
		handleAddInput,
		handleRemoveInput,
	};
}
