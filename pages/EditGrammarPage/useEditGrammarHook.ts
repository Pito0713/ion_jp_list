import {ref} from 'vue';
export function useEditGrammarHook() {
	// @use hook
	const {$api, $configUtils} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @Statements
	const grammarInput = ref(null);
	const grammarTransInput = ref(null);
	const sentenceInput = ref(null);
	const extraTextInputs = ref<{jpValue: string; chValue: string}[]>([]);
	const isSubmit = ref(false); // 提交按鈕 avoid 重複點擊

	// @router fit i18
	const route = useRoute();
	const targetQuery =
		typeof route.query?.value === 'string' ? $configUtils.decodeBase64(route.query.value) : null;
	const router = useRouter();
	const localePath = useLocalePath();

	// @Pinia
	const store = modalStore();

	onMounted(async () => {
		// update routeDate into the current Page
		try {
			if (route.query?.value) {
				grammarInput.value = targetQuery.grammarInput;
				grammarTransInput.value = targetQuery.grammarTransInput;
				sentenceInput.value = targetQuery.sentenceInput;
				extraTextInputs.value = targetQuery.extraTextInputs;
			}
		} catch (err) {
			console.error('Failed to fetch text:', err);
		}
	});

	// 新增補充單字
	const handleAddInput = () => {
		extraTextInputs.value.push({jpValue: '', chValue: ''});
	};

	// 移除對應 input 資料
	const handleRemoveInput = (_index: number) => {
		extraTextInputs.value.splice(_index, 1);
	};

	// @Api /editGrammar 修改文法
	const onSubmit = async () => {
		loadingIndicator.start();
		isSubmit.value = true; // button loading disabled
		let submitData = {
			_id: targetQuery._id, // Object id <String>
			grammarInput: grammarInput.value ?? '', // <String | undefined>
			grammarTransInput: grammarTransInput.value ?? '', // <String | undefined>
			sentenceInput: sentenceInput.value ?? '', // <String | undefined>
			extraTextInputs: JSON.stringify(extraTextInputs.value), // type Array turn type String for mongodb
		};
		let target = await $api.editGrammar(submitData);

		// success
		if (target?.status === 1) {
			store.ModalShow('success');
			// localePath for i18 translate
			router.push(localePath('/GrammarPage'));
		}
		isSubmit.value = false; // button loading disabled
		loadingIndicator.finish();
	};

	// @Api /deleteOneGrammar 刪除單個文法文本
	const handleDelete = async () => {
		loadingIndicator.start();
		let target = await $api.deleteOneGrammar({
			_id: targetQuery._id, // <String>
		});

		// success
		if (target?.status === 1) {
			// use Pinia store
			store.ModalShow('success');
			// localePath for i18 translate
			router.push(localePath('/GrammarPage'));
		}
		loadingIndicator.finish();
	};

	return {
		grammarInput,
		grammarTransInput,
		sentenceInput,
		extraTextInputs,
		isSubmit,
		onSubmit,
		handleAddInput,
		handleRemoveInput,
		handleDelete,
	};
}
