# 🏝️ 卡在國際通 - 沖繩四天三夜完美行程

一個專為沖繩旅遊規劃的實用網站，提供完整的出國前確認清單、四天三夜行程安排、景點介紹與美食推薦。

## ✨ 功能特色

### 📋 出國前確認清單
- ✅ 互動式打包清單，支援勾選功能
- 📊 即時進度顯示
- 📂 六大分類清單（證件、電子產品、衣物、盥洗、藥品、其他）
- ➕ 可新增自訂項目
- 💾 自動儲存於 LocalStorage
- 🖨️ 列印功能
- 📥 匯出為文字檔

### 🗺️ 四天行程規劃
- Day 1: 抵達沖繩 + 國際通巡禮
- Day 2: 彈性一日遊
- Day 3: 波上宮 + 泊港漁市場
- Day 4: 瀨長島 + iias 豐崎 + 返台

### 🌐 其他功能
- 響應式設計（RWD），支援手機、平板、電腦
- 多語言支援（繁體中文、英文）
- 實用旅遊提醒（氣候、行李限重、禁帶物品）

## 🚀 快速開始

### 本地開發

1. **Clone 專案**
   ```bash
   git clone https://github.com/your-username/stuck-in-kokusai-street.git
   cd stuck-in-kokusai-street
   ```

2. **啟動本地伺服器**

   使用 Python:
   ```bash
   python -m http.server 8000
   ```

   或使用 Node.js:
   ```bash
   npx http-server -p 8000
   ```

   或使用 VS Code Live Server 擴充套件

3. **開啟瀏覽器**
   ```
   http://localhost:8000
   ```

## 📁 專案結構

```
stuck-in-kokusai-street/
├── index.html              # 首頁（出國前確認清單）
├── itinerary.html          # 行程總覽
├── day1.html               # Day 1 詳細行程
├── day2.html               # Day 2 詳細行程
├── day3.html               # Day 3 詳細行程
├── day4.html               # Day 4 詳細行程
│
├── css/
│   ├── reset.css           # CSS Reset
│   ├── variables.css       # CSS 變數
│   ├── common.css          # 共用樣式
│   ├── home.css            # 首頁樣式
│   ├── itinerary.css       # 行程總覽樣式
│   └── day.css             # 單日行程樣式
│
├── js/
│   ├── config.js           # 設定檔
│   ├── common.js           # 共用功能
│   ├── packing-list.js     # 打包清單功能
│   ├── weather.js          # 天氣 API 整合
│   ├── currency.js         # 匯率換算功能
│   └── map.js              # Google Maps 整合
│
├── images/
│   ├── hero/               # Hero 主視覺圖片
│   ├── attractions/        # 景點照片
│   ├── food/               # 美食照片
│   └── icons/              # 圖示
│
└── README.md               # 專案說明文件
```

## 🛠️ 技術棧

- **HTML5**: 語意化標籤
- **CSS3**: Flexbox、Grid、CSS Variables、動畫
- **JavaScript (ES6+)**: 原生 JavaScript，無框架
- **LocalStorage**: 客戶端資料儲存
- **Google Maps API**: 地圖與位置顯示
- **OpenWeather API**: 天氣資訊
- **ExchangeRate API**: 即時匯率

## 🎨 設計系統

### 顏色
- 主色：海洋藍 `#1E88E5`
- 次要色：珊瑚橙 `#FF7043`
- 強調色：夕陽金 `#FFA726`

### 字體
- 中文：Noto Sans TC
- 英文：Inter / Roboto

### 間距系統
- 8px 基準網格系統

## 📱 響應式設計

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

## 🌐 API 設定

在 `js/config.js` 中設定 API Keys:

```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
    WEATHER_API_KEY: 'YOUR_WEATHER_API_KEY',
    // ...
};
```

## 📄 授權

MIT License

## 👨‍💻 開發者

- PM: [待填寫]
- UI/UX 設計師: [待填寫]
- 前端工程師: [待填寫]

## 🙏 致謝

- 沖繩觀光局
- Google Maps Platform
- OpenWeather
- 所有提供靈感的旅遊網站

## 📮 聯絡我們

如有任何問題或建議，歡迎透過 GitHub Issues 聯絡我們。

---

**祝你有個美好的沖繩之旅！🌴✨**
