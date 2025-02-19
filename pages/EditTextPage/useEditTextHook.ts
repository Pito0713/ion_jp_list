import {ref} from 'vue';
export function useEditTextHook() {
	// @use hook
	const {$api, $configUtils} = useNuxtApp();
	const loadingIndicator = useLoadingIndicator();

	// @State
	const textInput = ref(null);
	const transInput = ref(null);
	const textHiraganaInput = ref(null);
	const textTransInput = ref(null);
	const inputs = ref<{jpValue: string; chValue: string}[]>([]);
	const tagArray = ref<{name: string; active: boolean}[]>([]);
	const isSubmit = ref(false); // 提交按鈕 avoid 重複點擊

	// @router fit i18
	const route = useRoute();
	const targetQuery =
		typeof route.query?.value === 'string' ? $configUtils.decodeBase64(route.query.value) : null;
	const router = useRouter();
	const localePath = useLocalePath();

	// @Pinia
	const store = modalStore();

	/*
	 * Nuxt useState
	 * 頁面掛載後, 調用 infoState 個人狀態資料
	 * 若 route.query 有 tag 對應資料進行啟用 active 狀態
	 */
	const infoState = useState<{info: {tags: string[]}}>('infoState');
	onMounted(async () => {
		try {
			if (infoState?.value?.info?.tags?.length > 0) {
				tagArray.value = infoState?.value?.info?.tags.map((item) => {
					// if item matches the TargetTag form routeDate return active true
					if (targetQuery?.tags?.length > 0) {
						let match = targetQuery?.tags.filter((_item: string) => item === _item);
						if (match.length > 0) {
							return {name: item, active: true};
						}
					}
					return {name: item, active: false};
				});
			}
		} catch (err) {
			console.error('Failed to fetch text:', err);
		}
	});

	onMounted(async () => {
		// update routeDate into the current Page
		try {
			if (route.query?.value) {
				textInput.value = targetQuery.file;
				textTransInput.value = targetQuery.fileTranslate;
				textHiraganaInput.value = targetQuery.fileHiragana;
				transInput.value = targetQuery.translation;
				inputs.value = targetQuery.inputs;
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
		if (tagArray.value) {
			tagArray.value[_index].active = !tagArray.value[_index].active;
		}
	};

	// @Api /editText 提交資料
	const onSubmit = async () => {
		loadingIndicator.start();
		isSubmit.value = true; // button loading disabled
		let submitData = {
			_id: targetQuery._id, // Object id <String>
			file: textInput.value ?? '', // <String | undefined>
			fileTranslate: textTransInput.value ?? '', // <String | undefined>
			fileHiragana: textHiraganaInput.value ?? '', // <String | undefined>
			translation: transInput.value ?? '', // <String | undefined>
			inputs: JSON.stringify(inputs.value), // type Array turn type String for mongodb
			tags: tagArray.value
				? tagArray.value.filter((item) => item.active).map((item) => item.name)
				: [], //  <String>[]
		};
		let target = await $api.editText(submitData);

		// success
		if (target?.status === 1) {
			store.ModalShow('success');
			// localePath for i18 translate
			router.push(localePath('/TextPage'));
		}
		isSubmit.value = false; // button loading disabled
		loadingIndicator.finish();
	};

	// @Api /deleteOneText 資料刪除
	const handleDelete = async () => {
		loadingIndicator.start();
		let target = await $api.deleteOneText({
			_id: targetQuery._id, // <String>
		});

		// success
		if (target?.status === 1) {
			// use Pinia store
			store.ModalShow('success');
			// localePath for i18 translate
			router.push(localePath('/TextPage'));
		}
		loadingIndicator.finish();
	};

	return {
		textInput,
		textHiraganaInput,
		textTransInput,
		tagArray,
		transInput,
		inputs,
		isSubmit,
		targetQuery,
		onSubmit,
		handleTag,
		handleAddInput,
		handleRemoveInput,
		handleDelete,
	};
}
