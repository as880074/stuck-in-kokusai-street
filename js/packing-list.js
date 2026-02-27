/**
 * Packing List JavaScript
 * 打包清單核心功能
 */

// ========== 打包清單資料 ==========

const packingListData = {
    documents: {
        title: "重要證件",
        icon: "🪪",
        items: [
            { id: "doc-passport", text: "護照（有效期限需 6 個月以上）" },
            { id: "doc-vjw", text: "VJW（Visit Japan Web）QR Code 截圖" },
            { id: "doc-visa", text: "簽證 (確認是否辦妥)" },
            { id: "doc-ticket", text: "機票 (電子/紙本確認單)" },
            { id: "doc-hotel", text: "住宿預訂證明" },
            { id: "doc-cash", text: "日幣現鈔（建議多換小額，如千圓鈔）" },
            { id: "doc-credit-card", text: "信用卡（若有事先購買 JR 票券，需攜帶同一張卡）" },
            { id: "doc-ic-card", text: "交通 IC 卡（Suica / PASMO / Kitaca）" },
            { id: "doc-insurance", text: "旅遊平安險保單" },
            { id: "doc-id-copy", text: "台灣身分證影本（備用）" },
            { id: "doc-health-card", text: "健保卡" },
            { id: "doc-emergency", text: "緊急聯絡資訊" }
        ]
    },
    electronics: {
        title: "電子產品",
        icon: "🔌",
        items: [
            { id: "elec-sim", text: "網卡 / eSIM（確認開通日期）" },
            { id: "elec-powerbank", text: "行動電源（低溫耗電快，建議攜帶 2 顆）" },
            { id: "elec-charger", text: "充電器" },
            { id: "elec-cable", text: "傳輸線" },
            { id: "elec-adapter", text: "轉接頭（日本為雙孔扁插，台灣可通用）" },
            { id: "elec-camera", text: "相機 / 底片（低溫需注意電池保暖）" },
            { id: "elec-sim-pin", text: "取卡針" }
        ]
    },
    clothing: {
        title: "個人衣物（含保暖）",
        icon: "👕",
        items: [
            { id: "cloth-underwear", text: "換洗衣物（內衣褲 / 上衣 / 襪子）" },
            { id: "cloth-pajamas", text: "睡衣（飯店多附浴衣，怕冷或不習慣可自備）" },
            { id: "cloth-jacket", text: "防風防水羽絨外套（洋蔥式穿法）" },
            { id: "cloth-heattech", text: "發熱衣 / 發熱褲（Heatech 極暖 / 超極暖）" },
            { id: "cloth-pants", text: "一般長褲 / 刷毛褲" },
            { id: "cloth-socks", text: "厚毛襪 / 羊毛襪（建議多帶）" },
            { id: "cloth-scarf", text: "圍巾 / 脖圍" }
        ]
    },
    toiletries: {
        title: "盥洗 / 保養 / 化妝",
        icon: "🧴",
        items: [
            { id: "toil-makeup", text: "化妝品（底妝 / 彩妝）" },
            { id: "toil-skincare", text: "保養品（建議油類 / 霜類，日本氣候極乾）" },
            { id: "toil-makeup-remover", text: "卸妝乳 / 卸妝油" },
            { id: "toil-cleanser", text: "洗面乳" },
            { id: "toil-toothbrush", text: "牙刷 / 牙膏（日本提倡環保，部分飯店不提供）" },
            { id: "toil-floss", text: "牙線棒 / 棉花棒" },
            { id: "toil-shampoo", text: "洗髮乳 / 潤髮乳（飯店有，可自備慣用款）" },
            { id: "toil-lotion", text: "高保濕乳液 / 護手霜" },
            { id: "toil-lip-balm", text: "護唇膏" },
            { id: "toil-contact", text: "隱形眼鏡 / 藥水" }
        ]
    },
    medicine: {
        title: "常備藥品",
        icon: "💊",
        items: [
            { id: "med-cold", text: "感冒藥（含退燒）" },
            { id: "med-stomach", text: "腸胃藥" },
            { id: "med-pain", text: "止痛藥" },
            { id: "med-motion", text: "暈車藥（搭巴士）" },
            { id: "med-bandaid", text: "OK 繃 / 外傷藥膏" }
        ]
    },
    others: {
        title: "其他必備",
        icon: "🎒",
        items: [
            { id: "other-mask", text: "口罩（機上 / 人多處防護）" },
            { id: "other-laundry-bag", text: "髒衣袋 / 收納袋" },
            { id: "other-bottle", text: "空水壺（日本水龍頭可生飲，攜帶容器較方便）" },
            { id: "other-heat-pack", text: "暖暖包（貼式 / 手握，多準備）" },
            { id: "other-umbrella", text: "摺疊傘（以防濕雪 / 暴風雪）" },
            { id: "other-eco-bag", text: "購物袋（環保袋）" },
            { id: "other-compression-bag", text: "衣物壓縮袋（厚重衣物好收納）" },
            { id: "other-wet-wipes", text: "濕紙巾 / 酒精棉片" },
            { id: "other-shoes", text: "好穿的鞋子" }
        ]
    }
};

// ========== 全域變數 ==========

let checklistState = {};
let customItems = [];

// ========== 初始化 ==========

document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    renderChecklist();
    renderCustomItems();
    renderCategoryOverview();
    updateProgress();
    initEventListeners();
});

// ========== 渲染清單 ==========

function renderChecklist() {
    const container = document.getElementById('checklistSection');
    if (!container) return;

    let html = '';

    for (const [categoryKey, category] of Object.entries(packingListData)) {
        const isExpanded = checklistState.expanded?.[categoryKey] !== false;
        const { completed, total } = getCategoryStats(categoryKey);
        const isComplete = completed === total;

        html += `
            <section id="section-${categoryKey}" class="checklist-category">
                <div class="category-header ${isComplete ? 'complete' : ''}" data-category="${categoryKey}">
                    <div class="category-header-left">
                        <span class="category-icon">${category.icon}</span>
                        <h2 class="category-title">${category.title}</h2>
                        <span class="category-count">(${completed}/${total})</span>
                    </div>
                    <button class="toggle-btn ${isExpanded ? '' : 'collapsed'}" aria-label="${isExpanded ? '收合' : '展開'}">
                        ▼
                    </button>
                </div>
                <div class="category-content ${isExpanded ? '' : 'collapsed'}">
                    <ul class="checklist-items">
                        ${category.items.map(item => renderChecklistItem(categoryKey, item)).join('')}
                    </ul>
                </div>
            </section>
        `;
    }

    container.innerHTML = html;
}

function renderChecklistItem(categoryKey, item) {
    const isChecked = checklistState.items?.[categoryKey]?.[item.id] || false;

    return `
        <li class="checklist-item">
            <input
                type="checkbox"
                id="${item.id}"
                data-category="${categoryKey}"
                ${isChecked ? 'checked' : ''}
            >
            <label for="${item.id}">
                <span class="checkbox-custom"></span>
                <span class="item-text">${item.text}</span>
            </label>
        </li>
    `;
}

// ========== 自訂項目 ==========

function renderCustomItems() {
    const container = document.getElementById('customItemsList');
    if (!container) return;

    if (customItems.length === 0) {
        container.innerHTML = '<p style="color: var(--gray-500); text-align: center;">尚無自訂項目</p>';
        return;
    }

    let html = '';

    customItems.forEach(item => {
        html += `
            <div class="custom-item">
                <input
                    type="checkbox"
                    id="${item.id}"
                    data-custom="true"
                    ${item.checked ? 'checked' : ''}
                >
                <label for="${item.id}">
                    <span class="checkbox-custom"></span>
                    <span class="item-text">${item.text}</span>
                </label>
                <button class="delete-custom-btn" data-id="${item.id}">刪除</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

function addCustomItem() {
    const input = document.getElementById('customItemInput');
    const text = input.value.trim();

    if (!text) {
        showToast('請輸入項目名稱', 'warning');
        return;
    }

    // 檢查是否重複
    const isDuplicate = customItems.some(item => item.text === text);
    if (isDuplicate) {
        showToast('此項目已存在', 'warning');
        return;
    }

    const newItem = {
        id: `custom-${Date.now()}`,
        text: text,
        checked: false
    };

    customItems.push(newItem);
    saveStateToStorage();
    renderCustomItems();
    updateProgress();

    input.value = '';
    showToast('項目已新增', 'success');
}

function deleteCustomItem(itemId) {
    const item = customItems.find(i => i.id === itemId);
    if (!item) return;

    if (!confirm(`確定要刪除「${item.text}」嗎？`)) {
        return;
    }

    customItems = customItems.filter(i => i.id !== itemId);
    saveStateToStorage();
    renderCustomItems();
    updateProgress();

    showToast('項目已刪除', 'success');
}

// ========== 分類完成度一覽 ==========

function renderCategoryOverview() {
    const container = document.getElementById('categoryOverview');
    if (!container) return;

    let html = '';

    for (const [categoryKey, category] of Object.entries(packingListData)) {
        const { completed, total } = getCategoryStats(categoryKey);
        const isComplete = completed === total;

        html += `
            <div class="category-overview-item" data-category="${categoryKey}">
                <span class="category-overview-icon">${category.icon}</span>
                <div class="category-overview-info">
                    <div class="category-overview-name">${category.title}</div>
                    <div class="category-overview-count ${isComplete ? 'complete' : ''}">
                        ${completed}/${total}
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;

    // 添加點擊事件，跳轉到對應分類
    container.querySelectorAll('.category-overview-item').forEach(item => {
        item.addEventListener('click', () => {
            const categoryKey = item.getAttribute('data-category');
            scrollToElement(`#section-${categoryKey}`, 80);
        });
    });
}

// ========== 進度計算 ==========

function getCategoryStats(categoryKey) {
    const category = packingListData[categoryKey];
    const total = category.items.length;
    let completed = 0;

    category.items.forEach(item => {
        if (checklistState.items?.[categoryKey]?.[item.id]) {
            completed++;
        }
    });

    return { completed, total };
}

function getTotalStats() {
    let completed = 0;
    let total = 0;

    // 計算預設清單
    for (const [categoryKey, category] of Object.entries(packingListData)) {
        total += category.items.length;
        category.items.forEach(item => {
            if (checklistState.items?.[categoryKey]?.[item.id]) {
                completed++;
            }
        });
    }

    // 計算自訂項目
    total += customItems.length;
    completed += customItems.filter(item => item.checked).length;

    return { completed, total };
}

function updateProgress() {
    const { completed, total } = getTotalStats();
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 更新進度條
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressStats = document.getElementById('progressStats');

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }

    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }

    if (progressStats) {
        progressStats.textContent = `已完成 ${completed} / 總共 ${total} (${percentage}%)`;
    }

    // 更新分類標題的計數
    for (const [categoryKey, category] of Object.entries(packingListData)) {
        const { completed: catCompleted, total: catTotal } = getCategoryStats(categoryKey);
        const countElement = document.querySelector(`[data-category="${categoryKey}"] .category-count`);
        if (countElement) {
            countElement.textContent = `(${catCompleted}/${catTotal})`;
        }

        // 更新完成狀態
        const headerElement = document.querySelector(`[data-category="${categoryKey}"]`);
        if (headerElement) {
            if (catCompleted === catTotal) {
                headerElement.classList.add('complete');
            } else {
                headerElement.classList.remove('complete');
            }
        }
    }

    // 更新分類概覽
    renderCategoryOverview();
}

// ========== 事件監聽 ==========

function initEventListeners() {
    // Checkbox 變更事件（使用事件委派）
    document.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            handleCheckboxChange(e.target);
        }
    });

    // 分類展開/收合
    document.addEventListener('click', (e) => {
        const header = e.target.closest('.category-header');
        if (header) {
            toggleCategory(header);
        }

        // 刪除自訂項目
        const deleteBtn = e.target.closest('.delete-custom-btn');
        if (deleteBtn) {
            const itemId = deleteBtn.getAttribute('data-id');
            deleteCustomItem(itemId);
        }
    });

    // 全部展開按鈕
    const expandAllBtn = document.getElementById('expandAllBtn');
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', expandAll);
    }

    // 全部收合按鈕
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', collapseAll);
    }

    // 重置按鈕
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetChecklist);
    }

    // 列印按鈕
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', printChecklist);
    }

    // 匯出按鈕
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportChecklist);
    }

    // 新增自訂項目按鈕
    const addCustomItemBtn = document.getElementById('addCustomItemBtn');
    if (addCustomItemBtn) {
        addCustomItemBtn.addEventListener('click', addCustomItem);
    }

    // Enter 鍵新增自訂項目
    const customItemInput = document.getElementById('customItemInput');
    if (customItemInput) {
        customItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCustomItem();
            }
        });
    }
}

// ========== Checkbox 處理 ==========

function handleCheckboxChange(checkbox) {
    const isCustom = checkbox.getAttribute('data-custom') === 'true';

    if (isCustom) {
        // 自訂項目
        const itemId = checkbox.id;
        const item = customItems.find(i => i.id === itemId);
        if (item) {
            item.checked = checkbox.checked;
        }
    } else {
        // 預設清單項目
        const categoryKey = checkbox.getAttribute('data-category');
        const itemId = checkbox.id;

        if (!checklistState.items) {
            checklistState.items = {};
        }
        if (!checklistState.items[categoryKey]) {
            checklistState.items[categoryKey] = {};
        }

        checklistState.items[categoryKey][itemId] = checkbox.checked;
    }

    saveStateToStorage();
    updateProgress();
}

// ========== 分類展開/收合 ==========

function toggleCategory(header) {
    const categoryKey = header.getAttribute('data-category');
    const content = header.nextElementSibling;
    const toggleBtn = header.querySelector('.toggle-btn');

    const isExpanded = !content.classList.contains('collapsed');

    if (isExpanded) {
        content.classList.add('collapsed');
        toggleBtn.classList.add('collapsed');
        toggleBtn.setAttribute('aria-label', '展開');
    } else {
        content.classList.remove('collapsed');
        toggleBtn.classList.remove('collapsed');
        toggleBtn.setAttribute('aria-label', '收合');
    }

    // 儲存展開狀態
    if (!checklistState.expanded) {
        checklistState.expanded = {};
    }
    checklistState.expanded[categoryKey] = !isExpanded;
    saveStateToStorage();
}

function expandAll() {
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('collapsed');
    });

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('collapsed');
        btn.setAttribute('aria-label', '收合');
    });

    // 更新狀態
    if (!checklistState.expanded) {
        checklistState.expanded = {};
    }
    for (const categoryKey of Object.keys(packingListData)) {
        checklistState.expanded[categoryKey] = true;
    }
    saveStateToStorage();

    showToast('已展開所有分類', 'info');
}

function collapseAll() {
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.add('collapsed');
    });

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.add('collapsed');
        btn.setAttribute('aria-label', '展開');
    });

    // 更新狀態
    if (!checklistState.expanded) {
        checklistState.expanded = {};
    }
    for (const categoryKey of Object.keys(packingListData)) {
        checklistState.expanded[categoryKey] = false;
    }
    saveStateToStorage();

    showToast('已收合所有分類', 'info');
}

// ========== 重置清單 ==========

function resetChecklist() {
    if (!confirm('確定要清除所有勾選紀錄嗎？此操作無法復原。')) {
        return;
    }

    checklistState = { expanded: {} };
    customItems = [];

    saveStateToStorage();
    renderChecklist();
    renderCustomItems();
    updateProgress();

    showToast('清單已重置', 'success');
}

// ========== 列印 ==========

function printChecklist() {
    // 展開所有分類以便列印
    expandAll();

    // 延遲一下讓動畫完成
    setTimeout(() => {
        window.print();
    }, 300);
}

// ========== 匯出 ==========

function exportChecklist() {
    const { completed, total } = getTotalStats();
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    let content = '========================================\n';
    content += '       出國前確認清單\n';
    content += '       卡在國際通\n';
    content += '========================================\n\n';
    content += `總進度：${completed}/${total} (${percentage}%)\n\n`;

    // 匯出各分類
    for (const [categoryKey, category] of Object.entries(packingListData)) {
        const { completed: catCompleted, total: catTotal } = getCategoryStats(categoryKey);

        content += '----------------------------------------\n';
        content += `${category.icon} ${category.title} (${catCompleted}/${catTotal})\n`;
        content += '----------------------------------------\n';

        category.items.forEach(item => {
            const isChecked = checklistState.items?.[categoryKey]?.[item.id] || false;
            content += `${isChecked ? '☑' : '☐'} ${item.text}\n`;
        });

        content += '\n';
    }

    // 匯出自訂項目
    if (customItems.length > 0) {
        content += '----------------------------------------\n';
        content += `➕ 自訂項目 (${customItems.filter(i => i.checked).length}/${customItems.length})\n`;
        content += '----------------------------------------\n';

        customItems.forEach(item => {
            content += `${item.checked ? '☑' : '☐'} ${item.text}\n`;
        });

        content += '\n';
    }

    content += '========================================\n';
    content += `匯出時間：${new Date().toLocaleString('zh-TW')}\n`;
    content += '網址：https://stuckinkokusai.com\n';
    content += '========================================\n';

    // 下載檔案
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '出國前確認清單.txt';
    a.click();
    URL.revokeObjectURL(url);

    showToast('清單已匯出', 'success');
}

// ========== LocalStorage 管理 ==========

function saveStateToStorage() {
    try {
        const data = {
            items: checklistState.items || {},
            expanded: checklistState.expanded || {},
            customItems: customItems,
            lastUpdated: Date.now()
        };

        localStorage.setItem(CONFIG.STORAGE_KEYS.PACKING_LIST, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('儲存失敗', 'error');
    }
}

function loadStateFromStorage() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.PACKING_LIST);

        if (stored) {
            const data = JSON.parse(stored);
            checklistState = {
                items: data.items || {},
                expanded: data.expanded || {}
            };
            customItems = data.customItems || [];
        } else {
            // 初始化預設狀態（全部展開）
            checklistState = {
                items: {},
                expanded: {}
            };

            for (const categoryKey of Object.keys(packingListData)) {
                checklistState.expanded[categoryKey] = true;
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        checklistState = { items: {}, expanded: {} };
        customItems = [];
    }
}
