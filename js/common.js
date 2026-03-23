/**
 * Common.js - 共用功能
 * 包含 Header、Footer 動態生成、Mobile Menu、語言切換等
 */

// ========== Header / Navigation ==========

/**
 * 生成 Header HTML
 */
function generateHeader() {
    const currentPage = getCurrentPage();
    const lang = getCurrentLanguage();

    const header = `
        <header class="header">
            <div class="container">
                <nav class="nav-wrapper">
                    <!-- Logo -->
                    <a href="index.html" class="logo">
                        <span class="logo-icon">🏝️</span>
                        <span>${t('siteName')}</span>
                    </a>

                    <!-- Mobile Menu Toggle -->
                    <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <!-- Navigation Menu -->
                    <div class="nav-menu" id="navMenu">
                        <a href="index.html" class="nav-link ${currentPage === 'index' ? 'active' : ''}">${t('home')}</a>
                        <a href="itinerary.html" class="nav-link ${currentPage === 'itinerary' ? 'active' : ''}">${t('itinerary')}</a>
                        <a href="day1.html" class="nav-link ${currentPage === 'day1' ? 'active' : ''}">${t('day1')}</a>
                        <a href="day2.html" class="nav-link ${currentPage === 'day2' ? 'active' : ''}">${t('day2')}</a>
                        <a href="day3.html" class="nav-link ${currentPage === 'day3' ? 'active' : ''}">${t('day3')}</a>
                        <a href="day4.html" class="nav-link ${currentPage === 'day4' ? 'active' : ''}">${t('day4')}</a>

                        <!-- Language Switcher -->
                        <div class="language-switcher">
                            <button class="lang-btn ${lang === 'zh-TW' ? 'active' : ''}" data-lang="zh-TW">中文</button>
                            <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    `;

    return header;
}

/**
 * 初始化 Header
 */
function initHeader() {
    const headerContainer = document.getElementById('header');
    if (headerContainer) {
        headerContainer.innerHTML = generateHeader();
        initMobileMenu();
        initLanguageSwitcher();
    }
}

/**
 * 初始化 Mobile Menu
 */
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // 點擊連結後關閉選單
        const navLinks = menu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });

        // 點擊外部關閉選單
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }
}

/**
 * 初始化語言切換
 */
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

/**
 * 取得當前頁面名稱
 * @returns {string} 頁面名稱
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
}

// ========== Footer ==========

/**
 * 生成 Footer HTML
 */
function generateFooter() {
    const footer = `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <!-- 關於本站 -->
                    <div class="footer-section">
                        <h3>${t('footer.about')}</h3>
                        <p>這是一個專為沖繩四天三夜旅遊規劃的實用網站，提供完整的行程安排、打包清單、景點介紹與美食推薦，讓你的沖繩之旅更加輕鬆愉快！</p>
                    </div>

                    <!-- 快速連結 -->
                    <div class="footer-section">
                        <h3>${t('footer.quickLinks')}</h3>
                        <ul>
                            <li><a href="index.html" class="footer-link">${t('home')}</a></li>
                            <li><a href="itinerary.html" class="footer-link">${t('itinerary')}</a></li>
                            <li><a href="day1.html" class="footer-link">${t('day1')}</a></li>
                            <li><a href="day2.html" class="footer-link">${t('day2')}</a></li>
                            <li><a href="day3.html" class="footer-link">${t('day3')}</a></li>
                            <li><a href="day4.html" class="footer-link">${t('day4')}</a></li>
                        </ul>
                    </div>

                    <!-- 實用資源 -->
                    <div class="footer-section">
                        <h3>${t('footer.resources')}</h3>
                        <ul>
                            <li><a href="https://visitokinawa.jp" target="_blank" rel="noopener" class="footer-link">沖繩觀光局</a></li>
                            <li><a href="https://www.google.com/maps" target="_blank" rel="noopener" class="footer-link">Google Maps</a></li>
                            <li><a href="https://tabelog.com" target="_blank" rel="noopener" class="footer-link">Tabelog</a></li>
                            <li><a href="https://www.vjw.digital.go.jp" target="_blank" rel="noopener" class="footer-link">Visit Japan Web</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>${t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    `;

    return footer;
}

/**
 * 初始化 Footer
 */
function initFooter() {
    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
        footerContainer.innerHTML = generateFooter();
    }
}

// ========== Scroll to Top Button ==========

/**
 * 初始化回到頂部按鈕
 */
function initScrollToTop() {
    // 建立按鈕
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '↑';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        font-size: 24px;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
    `;

    document.body.appendChild(button);

    // 監聽滾動事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    // 點擊回到頂部
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover 效果
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'var(--primary-dark)';
        button.style.transform = 'translateY(-4px)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'var(--primary-color)';
        button.style.transform = 'translateY(0)';
    });
}

// ========== Toast 通知 ==========

/**
 * 顯示 Toast 通知
 * @param {string} message - 訊息內容
 * @param {string} type - 類型 (success, error, warning, info)
 * @param {number} duration - 顯示時間（毫秒）
 */
function showToast(message, type = 'info', duration = 3000) {
    // 移除舊的 toast
    const oldToast = document.getElementById('toast');
    if (oldToast) {
        oldToast.remove();
    }

    // 建立 toast 元素
    const toast = document.createElement('div');
    toast.id = 'toast';

    // 根據類型設定樣式
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span style="font-size: 20px; margin-right: 8px;">${icons[type]}</span>
        <span>${message}</span>
    `;

    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background-color: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        opacity: 0;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toast);

    // 觸發動畫
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // 自動移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========== Loading Spinner ==========

/**
 * 顯示 Loading
 * @param {string} message - Loading 訊息
 */
function showLoading(message = 'Loading...') {
    // 移除舊的 loading
    const oldLoading = document.getElementById('loading');
    if (oldLoading) {
        oldLoading.remove();
    }

    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        ">
            <div style="
                width: 48px;
                height: 48px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="
                color: white;
                margin-top: 16px;
                font-size: 16px;
            ">${message}</p>
        </div>
    `;

    // 添加動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(loading);
}

/**
 * 隱藏 Loading
 */
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

// ========== 頁面初始化 ==========

/**
 * DOMContentLoaded 事件處理
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化 Header 和 Footer
    initHeader();
    initFooter();

    // 初始化回到頂部按鈕
    initScrollToTop();

    // 淡入動畫
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 10);
});

// ========== 實用函數 ==========

/**
 * 取得查詢參數
 * @param {string} param - 參數名稱
 * @returns {string|null} 參數值
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * 設定查詢參數
 * @param {string} param - 參數名稱
 * @param {string} value - 參數值
 */
function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

/**
 * 複製文字到剪貼簿
 * @param {string} text - 要複製的文字
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('已複製到剪貼簿', 'success');
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('複製失敗', 'error');
    }
}

/**
 * 平滑滾動到元素
 * @param {string} selector - CSS 選擇器
 * @param {number} offset - 偏移量（像素）
 */
function scrollToElement(selector, offset = 80) {
    const element = document.querySelector(selector);
    if (element) {
        const top = element.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

// ========== Google Maps 工具函數 ==========

/**
 * 生成 Google Maps URL
 * @param {number} lat - 緯度
 * @param {number} lng - 經度
 * @param {string} name - 地點名稱
 * @returns {string} Google Maps URL
 */
function getGoogleMapsUrl(lat, lng, name = '') {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
}

/**
 * 創建 Google Maps 連結按鈕 HTML
 * @param {number} lat - 緯度
 * @param {number} lng - 經度
 * @param {string} name - 地點名稱
 * @param {string} buttonText - 按鈕文字（預設：「在 Google Maps 中打開」）
 * @returns {string} 按鈕 HTML
 */
function createGoogleMapsButton(lat, lng, name = '', buttonText = '📍 在 Google Maps 中打開') {
    const url = getGoogleMapsUrl(lat, lng, name);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="btn-sketch" style="display: inline-flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-sm); padding: var(--spacing-2) var(--spacing-3); background-color: #4285F4; color: white; text-decoration: none;">
        ${buttonText}
    </a>`;
}

// ========== 匯出函數 ==========

if (typeof window !== 'undefined') {
    window.showToast = showToast;
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.getQueryParam = getQueryParam;
    window.setQueryParam = setQueryParam;
    window.copyToClipboard = copyToClipboard;
    window.scrollToElement = scrollToElement;
    window.getGoogleMapsUrl = getGoogleMapsUrl;
    window.createGoogleMapsButton = createGoogleMapsButton;
}
