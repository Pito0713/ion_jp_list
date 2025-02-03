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
			file: string;
			inputs: string;
			translation: string;
		}

		let target = response?.data;
		if (target?.status === 1) {
			// 判斷 指定路由資料調整
			if (response?.config?.url === '/searchText') {
				target?.data.forEach((item: searchText) => {
					try {
						if (isJSON(item.inputs)) {
							// 將 inputs 轉換成 JSON 格式數據
							item.inputs = JSON.parse(item.inputs);
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

		return Promise.reject(error);
	};

	// axios攔截器
	axios.interceptors.request.use(requestInterceptor, requestInterceptorError);
	axios.interceptors.response.use(responseInterceptor, responseInterceptorError);

	const fetchApi_Data = async (method: string, url: string, body: any) => {
		try {
			const response = await axios({
				method: method,
				url: url,
				data: body,
			});
			return response.data;
		} catch (error: any) {
			return error;
		}
	};
	interface log {
		account?: string;
		password?: string;
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
	}
	// ------------- user -------------
	// user/註冊
	const register = async (submitData: log) => {
		let data = await fetchApi_Data('POST', `/register`, submitData);
		return data;
	};

	// user/登入
	const login = async (submitData: log) => {
		let data = await fetchApi_Data('POST', `/login`, submitData);
		return data;
	};

	// ------------- text -------------
	// text/新增單字
	const addText = async (submitData: text) => {
		let data = await fetchApi_Data('POST', `/addText`, submitData);
		return data;
	};

	// text/單字搜尋
	const searchText = async (submitData: text) => {
		let data = await fetchApi_Data('POST', `/searchText`, submitData);
		return data;
	};

	// text/修改單字
	const editText = async (submitData: text) => {
		let data = await fetchApi_Data('POST', `/editText`, submitData);
		return data;
	};

	// text/單字是否置頂
	const editTextShowTop = async (submitData: text) => {
		let data = await fetchApi_Data('POST', `/editTextShowTop`, submitData);
		return data;
	};

	// text/刪除單個單字文本
	// @param {string} _id
	const deleteOneText = async (submitData: text) => {
		let params = {
			_id: submitData._id,
		};
		let data = await fetchApi_Data('DELETE', `/deleteOneText`, params);
		return data;
	};

	// text/提供測驗題目
	const textTest = async () => {
		let data = await fetchApi_Data('GET', `/textTest`, '');
		return data;
	};

	// text/回答測驗
	const answerTest = async (submitData: text) => {
		let data = await fetchApi_Data('POST', `/answerTest`, submitData);
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
				textTest,
				answerTest,
			},
		},
	};
});
