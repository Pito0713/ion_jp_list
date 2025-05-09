// ~/plugins/api.js
import axios from 'axios';
import {getErrorCodeKey} from '../utils/errorCodes';
export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	/*
  env = ENV_PRODUCTION_DOMAIN & ENV_DEV_DOMAIN
	Authorization requires token
	*/
	const env = config.public.ENV_PRODUCTION_DOMAIN;
	axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
	axios.defaults.baseURL = env;
	// 請求
	const requestInterceptor = (config: any) => {
		// 請求10秒沒收到回應中斷
		config.timeout = 10000;

		let userToken = useCookie('userToken')?.value;
		if (userToken) config.headers['Authorization'] = `Bearer ${userToken}`;
		return config;
	};

	// 回應成功
	const responseInterceptor = (response: any) => {
		// 判斷是否 JSON
		const isJSON = (data: any) => {
			try {
				JSON.parse(data);
				return true;
			} catch (error) {
				return false;
			}
		};

		interface searchText {
			inputs: string;
			extraTextInputs: string;
		}

		let target = response?.data;
		if (target?.status === 1) {
			// 判斷 指定路由資料調整
			if ( ['/searchText', '/searchGrammar' ].includes(response?.config?.url)) {
				target?.data.forEach((item: searchText) => {
					try {
						if (isJSON(item.inputs) && response?.config?.url === '/searchText') {
							// 將 inputs 轉換成 JSON 格式數據
							item.inputs = JSON.parse(item.inputs);
						}
						if (isJSON(item.extraTextInputs) && response?.config?.url === '/searchGrammar') {
							// 將 inputs 轉換成 JSON 格式數據
							item.extraTextInputs = JSON.parse(item.extraTextInputs);
						}
					} catch (error) {
						console.log('解析失敗，非 JSON 格式：');
					}
				});
			}
		}
		return response;
	};

	// 請求錯誤
	const requestInterceptorError = (error: any) => {
		return Promise.reject(error);
	};

	// 回應錯誤
	const responseInterceptorError = (error: any) => {
		let errorTarget = error?.response?.data;
		/* 調用 全域 useState 
			inject value {
				_text: String --> errorCode translate errorText,
				_status: Number 
			}
		*/
		const store = modalStore();
		store.ModalShow(getErrorCodeKey(errorTarget?.errorStatusCode || 0), errorTarget?.statusCode);

		// error: 憑證過期
		if ([1001, 1002].includes(errorTarget?.errorStatusCode)) {
			const i18n = useCookie('i18n_redirected_ion')?.value || 'zhTW'; // default i18n
			const navState = useState('navState');
			// 清除 cookie
			useCookie('userToken').value = null;
			useCookie('userInfo').value = null;
			navState.value = {nav: false}; // set useState
			clearNuxtState('authState'); // 內建原生 function 清除useState狀態
			// 重新導向
			navigateTo(`/${i18n}/LogInPage`);
		}

		return Promise.reject(error);
	};

	// axios攔截器
	axios.interceptors.request.use(requestInterceptor, requestInterceptorError);
	axios.interceptors.response.use(responseInterceptor, responseInterceptorError);

	interface props {
		method?: string;
		url?: string;
		body?: any;
		params?: any;
	}

	// Data properties
	const fetchApi_Data = async (props: props) => {
		try {
			const response = await axios({
				method: props.method,
				url: props.url,
				data: props.body,
			});
			return response.data;
		} catch (error: any) {
			return error;
		}
	};

	// params filter search properties
	const fetchApi_Params = async (props: props) => {
		try {
			const response = await axios({
				method: props.method,
				url: props.url,
				params: props.params,
			});
			return response.data;
		} catch (error: any) {
			return error;
		}
	};
	interface log {
		account?: string | null;
		password?: string | null;
	}

	interface text {
		_id?: string;
		file?: string;
		fileTranslate?: string;
		translation?: string;
		inputs?: string;
		searchValue?: string;
		tags?: string[]; // 定義 tags 是一個字串陣列
		isShowTop?: boolean;
		selectId?: string; // 定義 tags 是一個字串陣列
		pageNumber?: number,
		pageSize?: number,
	}

	interface grammar {
		_id?: string;
		grammarInput?: string;
		grammarTransInput?: string;
		extraTextInputs?: string;
		sentenceInput?: string;
		searchValue?: string;
		isShowTop?: boolean;
		pageNumber?: number,
		pageSize?: number,
	}

	// ------------- user -------------
	// @user/ 註冊
	const register = async (submitData: log) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/register',
			body: submitData,
		});
		return data;
	};

	// @user/ 登入
	const login = async (submitData: log) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/login',
			body: submitData,
		});
		return data;
	};

	// ------------- text -------------

	// @text/ 單字搜尋
	const searchText = async (submitData: text) => {
		let data = await fetchApi_Params({
			method: 'GET',
			url: '/searchText',
			params: submitData,
		});
		return data;
	};

	// @text/ 新增單字
	const addText = async (submitData: text) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/addText',
			body: submitData,
		});
		return data;
	};

	// @text/ 修改單字
	const editText = async (submitData: text) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/editText',
			body: submitData,
		});
		return data;
	};

	// @text 單字是否置頂
	const editTextShowTop = async (submitData: text) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/editTextShowTop',
			body: submitData,
		});
		return data;
	};

	/*@text 刪除單個單字文本
	  @param _id {String} */
	const deleteOneText = async (submitData: text) => {
		let params = {
			_id: submitData._id,
		};
		let data = await fetchApi_Params({
			method: 'DELETE',
			url: '/deleteOneText',
			params: params,
		});
		return data;
	};

	// @text 測驗題目
	const textQuiz = async () => {
		let data = await fetchApi_Params({
			method: 'GET',
			url: '/textQuiz',
			params: '',
		});
		return data;
	};

	/*@text 測驗題目答案驗證
		@param file {String}
		@param _id {String}
		@param extraId {String}*/
	const answerQuiz = async (submitData: text) => {
		let data = await fetchApi_Params({
			method: 'GET',
			url: '/answerQuiz',
			params: submitData,
		});
		return data;
	};

	/*@text 每日測驗題目
		@param selectId {String}*/
	const answerDaily = async (submitData: text) => {
		let data = await fetchApi_Params({
			method: 'GET',
			url: '/answerDaily',
			params: submitData,
		});
		return data;
	};

	// ------------- grammar -------------

	// @grammar/ 文法搜尋
	const searchGrammar = async (submitData: grammar) => {
		let data = await fetchApi_Params({
			method: 'GET',
			url: '/searchGrammar',
			params: submitData,
		});
		return data;
	};

	// @grammar/ 新增文法
	const addGrammar = async (submitData: grammar) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/addGrammar',
			body: submitData,
		});
		return data;
	};

	// @grammar 文法是否置頂
	const editGrammarShowTop = async (submitData: grammar) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/editGrammarShowTop',
			body: submitData,
		});
		return data;
	};

	// @grammar/ 修改文法
	const editGrammar = async (submitData: grammar) => {
		let data = await fetchApi_Data({
			method: 'POST',
			url: '/editGrammar',
			body: submitData,
		});
		return data;
	};

	/*@grammar 刪除單個文法文本
	  @param _id {String} */
		const deleteOneGrammar = async (submitData: grammar) => {
			let params = {
				_id: submitData._id,
			};
			let data = await fetchApi_Params({
				method: 'DELETE',
				url: '/deleteOneGrammar',
				params: params,
			});
			return data;
		};


	return {
		provide: {
			api: {
				addText,
				searchText,
				editText,
				editTextShowTop,
				deleteOneText,
				register,
				login,
				textQuiz,
				answerQuiz,
				answerDaily,
				searchGrammar,
				addGrammar,
				editGrammar,
				editGrammarShowTop,
				deleteOneGrammar
			},
		},
	};
});
