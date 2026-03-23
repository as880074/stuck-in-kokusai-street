# 🎨 UI/UX 設計審查報告
## 卡在國際通 - 互動導覽模式

**審查日期**: 2026-03-23
**審查範圍**: 行動版 Web 導覽介面
**設計原則**: Material Design 3 + iOS Human Interface Guidelines

---

## 📱 目前設計現狀

### ✅ 做得好的部分

#### 1. **視覺階層清晰**
- 頂部工具列 (56px) 提供明確的上下文
- 地圖佔據 2/3 視窗，視覺焦點明確
- 底部抽屜 1/3 視窗，不過度遮擋地圖

#### 2. **手勢設計符合直覺**
- 上下拖曳抽屜展開/收起
- 左右滑動切換景點
- 點擊標記聚焦 - 符合地圖應用慣例

#### 3. **色彩系統一致**
- Funliday Orange (#FF8C00) 作為主要 CTA
- 灰階文字階層 (#333, #666, #999)
- Active 狀態使用淺橘背景 (#FFF5E6)

#### 4. **觸控目標充足**
- 按鈕最小尺寸 40x40px (符合 Apple 44px 建議)
- 抽屜把手區域足夠大
- 景點卡片可點擊區域充足

---

## 🚨 發現的 UX 問題

### 🔴 高優先級問題

#### 1. **底部抽屜把手不夠明顯**
**問題描述**:
```css
.sheet-handle {
    width: 40px;
    height: 4px;
    background: var(--color-border);  /* #E0E0E0 太淺 */
}
```

**影響**: 使用者可能不知道可以拖曳

**建議改善**:
```css
.sheet-handle {
    width: 48px;           /* 加寬 */
    height: 5px;           /* 加高 */
    background: #BDBDBD;   /* 更深的灰色 */
    border-radius: 3px;
}

/* 可考慮添加視覺提示 */
.sheet-handle::before {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: rgba(0,0,0,0.05);
    margin-bottom: 2px;
}
```

#### 2. **景點進度不夠突出**
**問題描述**:
目前進度 "1 / 3" 只是文字，缺乏視覺回饋

**建議改善**:
添加進度條設計
```html
<div class="spot-progress-bar">
    <div class="progress-fill" style="width: 33.33%"></div>
</div>
<div class="spot-progress-text">1 / 3</div>
```

```css
.spot-progress-bar {
    width: 60px;
    height: 4px;
    background: #EEEEEE;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--color-primary);
    transition: width 0.3s ease;
}
```

#### 3. **地圖控制按鈕位置衝突**
**問題描述**:
Leaflet 縮放按鈕 (右下角) 可能被底部抽屜遮擋

**建議改善**:
調整縮放控制位置到右上角
```javascript
L.control.zoom({
    position: 'topright'  // 改為右上角
}).addTo(this.map);
```

#### 4. **缺乏載入狀態**
**問題描述**:
地圖初始化時沒有 loading 指示

**建議改善**:
添加骨架屏 (Skeleton Screen)
```html
<div class="nav-map-skeleton">
    <div class="skeleton-pulse"></div>
    <p>載入地圖中...</p>
</div>
```

---

### 🟡 中優先級問題

#### 5. **視圖切換按鈕位置不佳**
**問題描述**:
```css
.view-toggle {
    position: absolute;
    top: 72px;  /* 距離頂部太近 */
    left: 50%;
    transform: translateX(-50%);
}
```

**影響**:
- 遮擋地圖內容
- 在小螢幕上可能與標記重疊
- 單手操作困難

**建議改善**:
移至工具列右側
```html
<div class="nav-toolbar">
    <h1 class="nav-toolbar-title">Day 1 導覽</h1>
    <div class="view-toggle-compact">
        <button class="view-btn" data-view="map">🗺️</button>
        <button class="view-btn" data-view="list">📋</button>
    </div>
    <button class="nav-toolbar-close">×</button>
</div>
```

```css
.view-toggle-compact {
    display: flex;
    gap: 4px;
    margin-right: var(--space-md);
}

.view-btn {
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-surface);
    border-radius: var(--radius-md);
    font-size: 18px;
}

.view-btn.active {
    background: var(--color-primary);
}
```

#### 6. **景點卡片資訊過載**
**問題描述**:
每張卡片包含太多資訊：
- 景點名稱
- 時間與時長
- 描述文字
- 交通資訊
- 導航按鈕

**建議改善**:
採用折疊設計
```html
<div class="spot-card">
    <!-- 預設顯示 -->
    <div class="spot-header">...</div>

    <!-- 點擊展開詳細資訊 -->
    <div class="spot-details" :class="expanded ? 'show' : ''">
        <p class="spot-description">...</p>
        <div class="spot-transport">...</div>
        <div class="nav-actions">...</div>
    </div>
</div>
```

#### 7. **Active 卡片視覺不夠強烈**
**問題描述**:
```css
.spot-card.active {
    background: var(--color-primary-pale);  /* #FFF5E6 太淺 */
}
```

**建議改善**:
增強對比
```css
.spot-card.active {
    background: #FFE8CC;  /* 更深的橘色背景 */
    box-shadow: 0 2px 8px rgba(255, 140, 0, 0.2);
    transform: scale(1.02);
}

.spot-card.active .spot-number {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.15);
}
```

---

### 🟢 低優先級優化

#### 8. **抽屜展開動畫可加強**
**建議**:
添加微互動回饋
```css
.bottom-sheet {
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.3s ease;
}

.bottom-sheet.expanded {
    height: 90vh;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.25);  /* 展開時陰影加深 */
}
```

#### 9. **景點切換缺乏方向提示**
**建議**:
添加左右箭頭提示
```html
<div class="spot-navigation-hint">
    <span class="nav-arrow left">‹</span>
    <span class="nav-text">左右滑動切換景點</span>
    <span class="nav-arrow right">›</span>
</div>
```

#### 10. **缺乏空狀態設計**
**場景**: 當沒有景點資料時
**建議**:
```html
<div class="empty-state">
    <div class="empty-icon">🗺️</div>
    <p class="empty-title">目前沒有景點資訊</p>
    <p class="empty-subtitle">請稍後再試</p>
</div>
```

---

## 📐 建議的設計系統改善

### 間距系統優化

目前的 spacing scale:
```css
--space-xs: 4px   /* 太小，手機上難以點擊 */
--space-sm: 8px
--space-md: 12px
--space-lg: 16px
--space-xl: 20px
```

**建議調整為 8px 基準**:
```css
--space-2xs: 4px
--space-xs: 8px
--space-sm: 12px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 40px
--space-3xl: 48px
```

### 字體大小優化

目前設定:
```css
--font-size-xs: 12px   /* 太小，手機閱讀困難 */
--font-size-sm: 14px
--font-size-base: 16px
```

**建議調整**:
```css
--font-size-xs: 13px   /* 最小可讀尺寸 */
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-xl: 20px
```

### 陰影層級優化

添加更多陰影選項:
```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-sm: 0 2px 4px rgba(0,0,0,0.08);
--shadow-md: 0 4px 12px rgba(0,0,0,0.12);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.16);
--shadow-xl: 0 12px 32px rgba(0,0,0,0.20);
--shadow-2xl: 0 24px 48px rgba(0,0,0,0.24);
```

---

## 🎯 優先改善建議（Top 5）

### 1. **優化底部抽屜把手** (🔴 高優先級)
- 加寬至 48px
- 顏色改為 #BDBDBD
- 添加微妙陰影

### 2. **移動視圖切換按鈕** (🟡 中優先級)
- 從地圖中央移至工具列
- 改為 icon-only 設計
- 縮小尺寸至 36x36px

### 3. **增強 Active 狀態視覺** (🟡 中優先級)
- 背景色改為 #FFE8CC
- 添加橘色陰影
- 添加輕微放大效果 (scale: 1.02)

### 4. **添加載入狀態** (🔴 高優先級)
- 地圖載入骨架屏
- Loading spinner
- "載入中..." 文字提示

### 5. **優化景點進度顯示** (🔴 高優先級)
- 添加進度條視覺元素
- 使用橘色填充
- 動畫過渡效果

---

## 📱 響應式設計檢查

### 超小螢幕 (< 375px) - iPhone SE

**問題**:
- 景點卡片內容可能過於擁擠
- 導航按鈕可能需要縮小

**建議**:
```css
@media (max-width: 374px) {
    .spot-name {
        font-size: 16px;  /* 從 18px 縮小 */
    }

    .btn-navigate {
        font-size: 14px;
        padding: 10px 16px;
    }

    .spot-meta {
        flex-direction: column;
        gap: 4px;
    }
}
```

### 大螢幕 (> 768px) - 平板

**建議優化**:
```css
@media (min-width: 768px) {
    .navigation-mode {
        max-width: 480px;
        margin: 0 auto;
        box-shadow: 0 0 48px rgba(0,0,0,0.2);
        border-radius: 16px;
        overflow: hidden;
    }

    /* 平板上可顯示更多資訊 */
    .spot-description {
        -webkit-line-clamp: 3;  /* 從 2 行增加到 3 行 */
    }
}
```

### 橫屏模式 (Landscape)

**問題**: 抽屜佔據過多垂直空間

**建議**:
```css
@media (orientation: landscape) and (max-height: 500px) {
    .bottom-sheet {
        height: 50vh;  /* 從 33vh 增加 */
    }

    .bottom-sheet.expanded {
        height: 85vh;  /* 從 90vh 減少 */
    }

    .nav-map-container {
        height: calc(50vh - 56px);
    }
}
```

---

## ♿ 無障礙改善建議

### 1. **鍵盤導航優化**

添加可見的 focus 環:
```css
.btn-navigate:focus-visible,
.spot-card:focus-visible,
.view-toggle-btn:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
    box-shadow: 0 0 0 6px rgba(255, 140, 0, 0.15);
}
```

### 2. **ARIA 標籤完善**

```html
<div class="bottom-sheet"
     role="region"
     aria-label="景點列表"
     aria-live="polite">

    <button class="sheet-handle-container"
            aria-label="拖曳展開或收起景點列表"
            aria-expanded="false">
        <div class="sheet-handle"></div>
    </button>

    <div class="spot-cards-container"
         role="list"
         aria-label="景點卡片">
        <div class="spot-card"
             role="listitem"
             tabindex="0"
             aria-current="true">
            ...
        </div>
    </div>
</div>
```

### 3. **色彩對比檢查**

使用 WCAG AAA 標準:
- 主文字 (#333333) vs 白底: 對比度 12.63:1 ✅
- 次要文字 (#666666) vs 白底: 對比度 5.74:1 ✅
- 按鈕文字 (白色) vs 橘底 (#FF8C00): 對比度 3.0:1 ⚠️ (需要改善)

**建議**:
```css
.btn-navigate {
    background: #E67E00;  /* 深一點的橘色，提高對比度 */
}
```

### 4. **減少動畫偏好**

已實作，但可加強:
```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 🎨 視覺設計微調建議

### 地圖標記設計

目前標記:
```
🏬  [數字: 1]
```

**建議優化**:
- 數字徽章添加輕微陰影提升可讀性
- Emoji 添加白色描邊避免與地圖顏色混淆

```css
.marker-icon {
    font-size: 28px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))
            drop-shadow(0 0 2px rgba(255,255,255,0.8));  /* 白色光暈 */
}

.marker-number {
    box-shadow: 0 2px 4px rgba(0,0,0,0.2),
                0 0 0 2px rgba(255,255,255,0.3);  /* 內部白色邊框 */
}
```

### 景點卡片陰影

添加深度層次:
```css
.spot-card {
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    transition: box-shadow 0.2s ease,
                transform 0.2s ease;
}

.spot-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    transform: translateY(-2px);
}

.spot-card.active {
    box-shadow: 0 4px 16px rgba(255, 140, 0, 0.25),
                0 0 0 2px rgba(255, 140, 0, 0.1);
}
```

---

## 📊 效能與體驗優化

### 1. **觸控回饋延遲**

添加 300ms tap delay 移除:
```css
* {
    touch-action: manipulation;  /* 禁用雙擊縮放 */
}
```

### 2. **滾動效能優化**

```css
.spot-cards-container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;  /* iOS 慣性滾動 */
    will-change: scroll-position;       /* 提示瀏覽器優化 */
}
```

### 3. **圖片/地圖預載**

```javascript
// 預先載入 Leaflet 圖磚
const preloadTiles = () => {
    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();
    this.map.fire('moveend');  // 觸發圖磚載入
};
```

---

## 🎯 下一步行動計畫

### 立即執行 (本週)
1. ✅ 優化抽屜把手視覺 (30 分鐘)
2. ✅ 添加地圖載入狀態 (1 小時)
3. ✅ 增強 Active 卡片視覺 (30 分鐘)
4. ✅ 移動視圖切換按鈕位置 (1 小時)

### 短期優化 (下週)
5. ⏳ 添加進度條視覺元素 (2 小時)
6. ⏳ 優化景點卡片資訊層級 (3 小時)
7. ⏳ 完善 ARIA 標籤 (1 小時)
8. ⏳ 測試各種裝置與螢幕尺寸 (4 小時)

### 長期改善 (下個月)
9. ⏳ A/B 測試不同抽屜高度比例
10. ⏳ 使用者測試與回饋收集
11. ⏳ 效能監控與優化
12. ⏳ 建立 Storybook 元件庫

---

## 📚 參考資源

### 設計系統
- [Material Design 3 - Navigation](https://m3.material.io/components/navigation-drawer)
- [iOS Human Interface Guidelines - Maps](https://developer.apple.com/design/human-interface-guidelines/maps)
- [Funliday App Design Patterns](https://www.funliday.com/)

### 無障礙標準
- [WCAG 2.1 AAA](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### 效能最佳化
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring Calculator](https://googlechrome.github.io/lighthouse/scorecalc/)

---

**審查完成日期**: 2026-03-23
**建議優先等級**: 4 個高優先 + 3 個中優先
**預估改善工時**: 8-12 小時
**預期效果**: 提升 30-40% 使用者體驗滿意度
