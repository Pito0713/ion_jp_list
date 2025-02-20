# ION_JP_Frontend 文檔

## 當前版本: [V1.0.17](###V1.0.17)

## API 文檔

[ION_JP_Frontend 前端開發文檔](https://hackmd.io/@2yWSjTRTT7Sj1GtQLLoU2g/B1TrVcJUJe)
[ION_JP_Frontend API文檔](https://hackmd.io/@2yWSjTRTT7Sj1GtQLLoU2g/B1IErITNyl)

## 專案

建立一個日文單字筆記操作網頁專案, 可輸入

1. 日文單字
2. 單字漢字 & 平假名
3. 例句
4. 補充額外單字
5. 隨機單字考題

## 技術

### 前端框架

- NUXT3 ( Vue 框架 & Composition API )
- Typescript
- Tailwindcss ( CSS )
- Pug ( html templete )
- Vee-validate 驗證套件
- Yup validation 驗證套件
- Axios（HTTP）
- I18n
- Pinia

### 專案結構

```
project/
├── assets/                 # 靜態資源
│   └── css                 # Tailwindcss custom css
├── components/             # 共用子件
│   └── global              # 全域使用
├── i18/                    # 語言翻譯
│   ├── en.json             # 英文
│   ├── jp.json             # 日文
│   ├── zhHant.json         # 簡體中文
│   └── zhTW.json           # 繁體中文
├── layouts/                # 頁面佈局子件
├── middleware/             # 中介
│   └── route_middleware    # 路由中介
├── pages/                  # 頁面
│   ├── LogInPage           # 登入頁
│   │   ├── LogInUI         # 登入頁 UI
│   │   ├── useLogInHook    # 登入頁 邏輯
│   │   └── index           # 登入頁 主頁
│   ├── Register            # 註冊頁
│   │   ├── RegisterUI      # 註冊頁 UI
│   │   ├── useRegisterHook # 註冊頁 邏輯
│   │   └── index           # 註冊頁 主頁
│   ├── AddTextPage         # 新增單字 功能頁
│   │   ├── addTextUI       # 新增單字 UI
│   │   ├── useAddTextHook  # 新增單字 邏輯
│   │   └── index           # 新增單字 主頁
│   ├── EditTextPage        # 修改單字 功能頁
│   │   ├── EditTextUI      # 修改單字 UI
│   │   ├── useEditTextHook # 修改單字 邏輯
│   │   └── index           # 修改單字 主頁
│   ├── TextPage            # 單字 功能頁
│   │   ├── TextUI_List     # 單字 清單 UI
│   │   ├── TextUI_Search   # 單字 搜尋 UI
│   │   ├── useTextHook     # 單字 邏輯
│   │   ├── useInfiniteScrollHook # 無限捲動 邏輯
│   │   └── index           # 單字 主頁
│   └── HomePage            # 首頁
│       ├── HomeUI          # 首頁 UI
│       ├── ListUI          # 首頁 UI
│       ├── useHomeHook     # 首頁 邏輯
│       ├── LoadingSkeleton # 載入動畫 組件
│       └── index           # 首頁 主頁
├── plugins/                # Nuxt 插件
│   ├── api                 # Api 功能
│   ├── configUtils         # 共用邏輯設定 功能
│   ├── auth                # token 驗證
│   └── nav                 # 導航欄 驗證
├── public/                 # 公共資源
│   └── img                 # 圖片
├── store/                  # Pinia 狀態管理
│   └── modalStore          # Modal 彈窗
├── utils/                  # 工具函數
│   └── errorCodes          # errorCode 文字轉換
├── .env                    # 環境變數
├── nuxt.config.ts          # Nuxt 配置
├── tailwind.config         # tailwind 配置
└── package.json            # 項目依賴
```

## 開發規範

### 元件代碼規範

- 變數命名採用 `camelCase` (駝峰式)。
- 共用子件採用 `PascalCase` (首字大寫)。
- TypeScript, 類型聲明必須完整準確。
- 必要的註解, 清晰定義 `prop` 值。
- 頁面開發需遵守單一組件應該只負責單一個職責
  EX: `UI` (頁面UI), `useHook`(頁面邏輯), `index` (頁面 `props` 導入)

### Git

- `main` 主分支：正式版本。
- `develop` 開發分支：合併開發版本分支。
- `feature` 功能分支：單一功能開發。
- `release` 版本分支：合併功能開發分支。
- `BUG` BUG分支：修改BUG錯誤。

## 版本

### V1.0.17

```
新增 TextPage 載入提示字
新增 LogPage 新增密碼 eye icon

修改 TextPage 拆分 infiniteScroll 架構與導入方式
修改 RegisterPage 子父件 props index 導入
調整 LogPage 子父件 props index 導入

移除 無使用 nuxtImage 套件

BUG 修正 tag 載入 info pinia 未更新狀態
BUG 修正筆記 無資料顯示文字提示
```

### V1.0.16

```
修改 api 路徑與 method 調整
新增 api request 拆分函式 param / data

新增 TextPage 排序功能(更新日期與重點單字排序)

BUG 修正每日答題 無資料顯示文字提示
BUG 修正筆記 無資料顯示文字提示
```

### V1.0.15

```
修改 HomePage 顯示每日作答題目
修改 HomePage UI 介面
修改 TextPage 重構拆分, 使用 SRP 原則, 拆分 add / edit 頁面頁面

新增 共用邏輯設定 /plugins/configUtils
新增 AddTextPage 頁面(原addTextPage)
新增 EditTextPage 頁面(原editTextPage)
新增 route 判斷未申請設定路徑, 跳出警告提示
```

### V1.0.14

```
BUG 修正 token 過期不轉跳問題

修改 LogInPage 重構拆分, 使用 SRP 原則
修改 HomePage 重構拆分, 使用 SRP 原則

新增 無限捲動, 頁面固定筆數減輕瀏覽器記憶體
新增 Resgister 頁面(原addLogInPage)
```

### V1.0.13

```
修改 api config 設定調整移除無用參數
修改 route middleware 路徑轉跳錯誤
修改 首頁測驗排版 & 新增載入動畫

新增 README 文檔
```

### V1.0.12

```
修改 Textpage 文字大小
修改 Textpage 提交按鈕 loading 狀態
修改 route middleware路徑轉跳
修改 各頁面 i18 route localPath 轉跳
新增 homePage/index 主頁頁面
```

### V1.0.11

```
修改 page/index 題目主頁 選項新增翻譯 ,進行資料轉譯分析
修改 Textpage/addTextPage 新增平假名欄位
修改 Textpage/editTextPage 新增平假名欄位
```

### V1.0.10

```
新增 text 測驗相關api
新增 無限捲動功能, 減輕伺服器負擔
新增 單字單筆刪除 api /deleteOneText

修改 component/Modal 有按狀態進行背景色修改
修改 page/index 改為測驗題目功能
修改 TextPage/editTextPage 新增刪除按鈕

移除 第三 api
```

### V1.0.9

```
新增 text 測驗相關api
修改 page/index 改為測驗題目功能
移除 第三方api
```

### V1.0.8

```
修改圖片 ImageFC 與導入相關圖片檔案
```

### V1.0.7

```
新增 TextPage/addTextPage 新增 copy 按鈕
新增 utils/errorCode 轉譯
新增 Pinia store/modalStore 彈窗樣式
新增 Component/Modal 彈窗
新增 單字置頂功能 api /eidtTextShowTop
新增 單字修改 api /eidtText

修改 api response status 狀態碼 success = 1

移除 store/authStore 彈窗樣式

```

### V1.0.6

```
新增 插件 plugin/nav  導入 cookies nav 參數控制
新增 插件 plugin/auth  導入 cookies userToken 參數控制
新增 插件 plugin/api  導入 api 相關程式碼
新增 page/layout 語言翻譯 select 選擇
新增 Nuxt config 環境參數

修改 各頁面移除 service api 相關參數 導入 plugin/ $api
修改 route middleware 新增判斷 Hydration render 問題

```

### V1.0.5

```
新增 圖片共用子件
新增 @nuxt/image 套件

修改 page/index 主頁導入第三方 api 資料
修改 nav 參數未登入則不顯示
修改 component 移至 global 全域資料
```

### V1.0.4

```
新增 NuxtLoadingIndicator 加載條
新增 i18 翻譯
新增 component/Tag 標籤共用子件
新增 TextPage/addTextPage 新增 tag 標籤
新增 TextPage/index 新增 tag 標籤

修改 修改 LogInPage/index Cookie 保留時間最多7天
修改 .gitignore 排除 .lock文件
刪除 .lock
```

### V1.0.3

```
新增 TextPage/index 搜尋功能

修改 service/api getText 街口, 改為 searchText
修改 service/api axios 請求攔截 heard 表頭新增 cookie token 資料
修改 TextPage/addTextPage 版面樣式
修改 LogInPage/index 版面調整
修改 LogInPage/addLoginPage 版面調整
```

### V1.0.2

```
修改 layouts 版本
修改 component/Card 樣式
```

### V1.0.1

```
新增 TextPage/addTextPage 頁面 (單字新增頁面)
新增 custom css
新增 @vee-validate 套件
新增 yup 套件
新增 axios 套件
新增 Nav 導覽行 TextPage 路由接口
```
