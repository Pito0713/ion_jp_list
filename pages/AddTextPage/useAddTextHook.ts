import {ref, reactive} from 'vue';
export function useAddTextHook() {
	// @use hook
	const {$api} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @Statements
	const textInput = ref(null);
	const transInput = ref(null);
	const textHiraganaInput = ref(null);
	const textTransInput = ref(null);
	const inputs = ref<{jpValue: string; chValue: string}[]>([]);
	const tagArray = ref<{name: string; active: boolean}[]>([]); // TAG 詞語標注 ex: 動詞, 名詞...
	const isSubmit = ref(false); // 提交按鈕 avoid 重複點擊

	// @router fit i18
	const router = useRouter();
	const localePath = useLocalePath();

	/*
	 * Nuxt useState
	 * 頁面掛載後, 調用 infoState 個人狀態資料
	 */
	const infoState = useState<{info: {tags: string[]}}>('infoState');
	onMounted(async () => {
		try {
			// 若有 info 值 導入基礎 tag 值
			if (infoState?.value?.info?.tags?.length > 0) {
				tagArray.value = infoState?.value?.info?.tags.map((item) => {
					// default value ['verb', 'noun', 'adjective', 'particle']
					return {name: item, active: false};
				});
			}
		} catch (err) {
			console.error('Failed to fetch text:', err);
		}
	});

	// 新增補充單字
	const handleAddInput = () => {
		inputs.value.push({jpValue: '', chValue: ''});
	};

	// 移除對應 input 資料
	const handleRemoveInput = (_index: number) => {
		inputs.value.splice(_index, 1);
	};

	// 觸發對應 tag active 資料, 是否顯示
	const handleTag = async (_index: number) => {
		tagArray.value[_index].active = !tagArray.value[_index].active;
	};

	// @api /addText  新增單字
	const onSubmit = async () => {
		loadingIndicator.start();
		isSubmit.value = true; // button loading disabled
		let submitData = {
			file: textInput.value ?? '', // <String | undefined>ㄩ
			fileTranslate: textTransInput.value ?? '', // <String | undefined>
			fileHiragana: textHiraganaInput.value ?? '', // <String | undefined>
			translation: transInput.value ?? '', // <String | undefined>
			inputs: JSON.stringify(inputs.value), // type Array turn type String for mongodb
			tags: tagArray.value.filter((item) => item.active).map((item) => item.name), //  <String>[]
		};
		let target = await $api.addText(submitData);
		// success
		if (target?.status === 1) {
			// localePath for i18 translate
			router.push(localePath('/TextPage'));
		}
		isSubmit.value = false; // button loading disabled
		loadingIndicator.finish();
	};

	return {
		textInput,
		textHiraganaInput,
		textTransInput,
		tagArray,
		transInput,
		inputs,
		onSubmit,
		handleTag,
		handleAddInput,
		handleRemoveInput,
	};
}
