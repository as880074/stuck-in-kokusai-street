/**
 * Config.js - 網站設定檔
 * 包含 API Keys、語言設定、常數等
 */

const CONFIG = {
    // ========== API Keys ==========
    // 注意：實際部署時，這些 Key 應該設定網域限制或使用環境變數

    // Google Maps API Key
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',

    // OpenWeather API Key
    WEATHER_API_KEY: 'YOUR_WEATHER_API_KEY',

    // ExchangeRate API Key (可選，免費版不需要)
    CURRENCY_API_KEY: '',

    // ========== 語言設定 ==========

    DEFAULT_LANG: 'zh-TW',
    SUPPORTED_LANGUAGES: ['zh-TW', 'en'],

    // ========== 位置資訊 ==========

    // 沖繩座標
    OKINAWA_LAT: 26.2124,
    OKINAWA_LNG: 127.6809,

    // 那霸座標
    NAHA_LAT: 26.2124,
    NAHA_LNG: 127.6809,

    // ========== API Endpoints ==========

    // OpenWeather API (5 Day Forecast)
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5/forecast',

    // ExchangeRate API
    CURRENCY_API_URL: 'https://api.exchangerate-api.com/v4/latest/TWD',

    // ========== LocalStorage Keys ==========

    STORAGE_KEYS: {
        PACKING_LIST: 'packingList',
        CUSTOM_ITEMS: 'customItems',
        LANGUAGE: 'language',
        EXPANDED_CATEGORIES: 'expandedCategories',
        WEATHER_CACHE: 'weatherCache',
        CURRENCY_CACHE: 'currencyCache'
    },

    // ========== 快取時間設定 (毫秒) ==========

    CACHE_DURATION: {
        WEATHER: 60 * 60 * 1000,    // 1 小時
        CURRENCY: 60 * 60 * 1000,   // 1 小時
    },

    // ========== 日期設定 ==========

    TRIP_DATES: {
        START: '2025-03-30',
        END: '2025-04-02',
        DAYS: 4,
        NIGHTS: 3
    },

    // ========== 匯率設定 ==========

    // 預設匯率（當 API 失敗時使用）
    DEFAULT_EXCHANGE_RATE: {
        TWD_TO_JPY: 0.22,  // 1 TWD = 0.22 JPY
        JPY_TO_TWD: 4.5    // 1 JPY = 4.5 TWD
    },

    // ========== 景點座標 ==========

    LOCATIONS: {
        // Day 1
        NAHA_AIRPORT: { lat: 26.1958, lng: 127.6458, name: '那霸機場' },
        PARCO_CITY: { lat: 26.2447, lng: 127.6981, name: 'PARCO CITY' },
        HOTEL_LANTAMA: { lat: 26.2158, lng: 127.6790, name: 'Hotel Lantama' },
        KOKUSAI_DORI: { lat: 26.2158, lng: 127.6790, name: '國際通' },

        // Day 3
        NAMINOUE_SHRINE: { lat: 26.2158, lng: 127.6628, name: '波上宮' },
        TOMARI_PORT: { lat: 26.2225, lng: 127.6704, name: '泊港漁市場' },

        // Day 4
        MAKISHI_MARKET: { lat: 26.2152, lng: 127.6797, name: '第一牧志公設市場' },
        SENAGAJIMA: { lat: 26.1783, lng: 127.6500, name: '瀨長島' },
        IIAS_TOYOSAKI: { lat: 26.1617, lng: 127.6650, name: 'iias 豐崎' }
    },

    // ========== 多語言文字 ==========

    TRANSLATIONS: {
        'zh-TW': {
            siteName: '卡在國際通',
            home: '首頁',
            itinerary: '行程總覽',
            day1: 'Day 1',
            day2: 'Day 2',
            day3: 'Day 3',
            day4: 'Day 4',
            packingList: '打包清單',
            checkAll: '全部展開',
            uncheckAll: '全部收合',
            reset: '重置清單',
            print: '列印',
            export: '匯出',
            addCustomItem: '新增自訂項目',
            delete: '刪除',
            completed: '已完成',
            total: '總共',
            progress: '進度',
            weather: '天氣',
            currency: '匯率換算',
            tips: '旅遊小貼士',
            viewItinerary: '查看四天行程安排',
            footer: {
                about: '關於本站',
                quickLinks: '快速連結',
                resources: '實用資源',
                copyright: '© 2024 卡在國際通 | Made with ❤️'
            }
        },
        'en': {
            siteName: 'Stuck in Kokusai Street',
            home: 'Home',
            itinerary: 'Itinerary',
            day1: 'Day 1',
            day2: 'Day 2',
            day3: 'Day 3',
            day4: 'Day 4',
            packingList: 'Packing List',
            checkAll: 'Expand All',
            uncheckAll: 'Collapse All',
            reset: 'Reset',
            print: 'Print',
            export: 'Export',
            addCustomItem: 'Add Custom Item',
            delete: 'Delete',
            completed: 'Completed',
            total: 'Total',
            progress: 'Progress',
            weather: 'Weather',
            currency: 'Currency Exchange',
            tips: 'Travel Tips',
            viewItinerary: 'View 4-Day Itinerary',
            footer: {
                about: 'About',
                quickLinks: 'Quick Links',
                resources: 'Resources',
                copyright: '© 2024 Stuck in Kokusai Street | Made with ❤️'
            }
        }
    }
};

// ========== 實用函數 ==========

/**
 * 取得翻譯文字
 * @param {string} key - 翻譯的 key
 * @param {string} lang - 語言代碼，預設為當前語言
 * @returns {string} 翻譯後的文字
 */
function t(key, lang = null) {
    const currentLang = lang || getCurrentLanguage();
    const keys = key.split('.');
    let value = CONFIG.TRANSLATIONS[currentLang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

/**
 * 取得當前語言
 * @returns {string} 語言代碼
 */
function getCurrentLanguage() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || CONFIG.DEFAULT_LANG;
}

/**
 * 設定語言
 * @param {string} lang - 語言代碼
 */
function setLanguage(lang) {
    if (CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
        location.reload(); // 重新載入頁面以套用語言
    }
}

/**
 * 檢查快取是否有效
 * @param {string} key - LocalStorage key
 * @param {number} duration - 快取有效期限（毫秒）
 * @returns {object|null} 快取資料或 null
 */
function getCachedData(key, duration) {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = Date.now();

        if (now - data.timestamp < duration) {
            return data.value;
        }

        // 快取過期，移除
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

/**
 * 儲存快取資料
 * @param {string} key - LocalStorage key
 * @param {any} value - 要快取的資料
 */
function setCachedData(key, value) {
    try {
        const data = {
            value: value,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式 (YYYY-MM-DD, MM/DD, etc.)
 * @returns {string} 格式化後的日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @param {string} currency - 貨幣代碼 (JPY, TWD)
 * @returns {string} 格式化後的金額
 */
function formatCurrency(amount, currency = 'JPY') {
    const symbols = {
        JPY: '¥',
        TWD: 'NT$'
    };

    const symbol = symbols[currency] || currency;
    const formattedAmount = Math.round(amount).toLocaleString();

    return `${symbol}${formattedAmount}`;
}

/**
 * Debounce 函數
 * @param {Function} func - 要執行的函數
 * @param {number} wait - 延遲時間（毫秒）
 * @returns {Function} Debounced 函數
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== 匯出設定 ==========

// 如果在瀏覽器環境中，將 CONFIG 掛載到 window
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.t = t;
    window.getCurrentLanguage = getCurrentLanguage;
    window.setLanguage = setLanguage;
    window.getCachedData = getCachedData;
    window.setCachedData = setCachedData;
    window.formatDate = formatDate;
    window.formatCurrency = formatCurrency;
    window.debounce = debounce;
}
