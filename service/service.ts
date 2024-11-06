import axios from "axios";
import { ENV } from "./env.js";
const env = ENV.DEV;
// 請求
const requestInterceptor = (config: any) => {
  // 請求10秒沒收到回應中斷
  config.timeout = 10000;
  // headers: {
  //   Authorization: "Bearer " + auth,
  //   "Content-Type": "application/x-www-form-urlencoded",
  // },
  return config;
};

// 回應
const responseInterceptor = (response: any) => {
  const isJSON = (data: any) => {
    try {
      JSON.parse(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  interface getText {
    file: string;
    inputs: string;
    translation: string;
  }
  let target = response?.data;
  if (target?.status === "success") {
    if (response?.config?.url === "/getText") {
      target?.data.forEach((item: getText) => {
        try {
          if (isJSON(item.inputs)) {
            item.inputs = JSON.parse(item.inputs); // 將 inputs 轉換成 JSON 格式數據
          }
        } catch (error) {
          console.log("解析失敗，非 JSON 格式：");
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
  return Promise.reject(error);
};

axios.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.baseURL = env.DOMAIN;

// axios攔截器
axios.interceptors.request.use(requestInterceptor, requestInterceptorError);
axios.interceptors.response.use(responseInterceptor, responseInterceptorError);

const fetchApi_Data = async (
  method: string,
  url: string,
  params: string | undefined,
  body: any
) => {
  try {
    const response = await axios({
      method: method,
      url: url + params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: body,
    });
    return response.data;
  } catch (error: any) {
    return error;
  }
};

const ServiceApi = {
  addText: async (submitData: any) => {
    console.log(submitData);
    let data = await fetchApi_Data("POST", `/addText`, "", submitData);
    return data;
  },
  getText: async () => {
    let data = await fetchApi_Data("POST", `/getText`, "", "");
    return data;
  },
};

export default ServiceApi;
