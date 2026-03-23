# 🗺️ 互動導覽模式改版規格書

## 決策摘要
- **改版範圍**: 完整重構為互動導覽 App
- **設計風格**: Funliday 風格（#FF8C00 亮橘色 + #333333 深灰）
- **地圖技術**: Leaflet.js + OpenStreetMap
- **頁面策略**: 改造現有 day1-4.html，加入「導覽模式」切換

---

## Phase 1: 基礎架構與設計系統重構 (Week 1-2)

### 1.1 設計系統更新

**新增 CSS 變數** (`css/variables.css`):
```css
/* Funliday Brand Colors */
--color-primary: #FF8C00;        /* 亮橘色 - CTA & 導航 */
--color-primary-dark: #E67E00;   /* 橘色深色版 */
--color-primary-light: #FFA533;  /* 橘色淺色版 */
--color-text-primary: #333333;   /* 深灰主文字 */
--color-text-secondary: #666666; /* 次要文字 */
--color-background: #FFFFFF;     /* 白色背景 */
--color-surface: #F5F5F5;        /* 淺灰表面 */

/* Navigation UI Colors */
--color-nav-active: var(--color-primary);
--color-nav-inactive: #999999;

/* Map UI */
--marker-size: 32px;
--marker-number-bg: var(--color-primary);

/* Bottom Sheet */
--sheet-border-radius: 16px;
--sheet-height-collapsed: 33vh;   /* 1/3 螢幕高度 */
--sheet-height-expanded: 90vh;    /* 展開後高度 */
```

**新增元件樣式** (`css/navigation.css`):
```css
/* 導覽模式專用樣式 */
.navigation-mode {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

/* 地圖容器 - 佔 2/3 */
.nav-map-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 67vh;
    z-index: 1;
}

/* 底部抽屜 - 佔 1/3 */
.bottom-sheet {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: var(--sheet-height-collapsed);
    background: white;
    border-radius: var(--sheet-border-radius) var(--sheet-border-radius) 0 0;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
}

.bottom-sheet.expanded {
    height: var(--sheet-height-expanded);
}

/* 抽屜把手 */
.sheet-handle {
    width: 40px;
    height: 4px;
    background: #CCCCCC;
    border-radius: 2px;
    margin: 12px auto;
    cursor: grab;
}

/* 景點卡片 */
.spot-card {
    padding: 20px;
    border-bottom: 1px solid #EEEEEE;
    cursor: pointer;
    transition: background 0.2s;
}

.spot-card.active {
    background: #FFF5E6; /* 淡橘色背景 */
    border-left: 4px solid var(--color-primary);
}

/* 導航按鈕組 */
.nav-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

.btn-navigate {
    flex: 1;
    padding: 12px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-navigate:active {
    background: var(--color-primary-dark);
}
```

### 1.2 JavaScript 架構設計

**新增導覽模組** (`js/navigation.js`):
```javascript
class NavigationMode {
    constructor(spots, mapElement) {
        this.spots = spots;              // 景點陣列
        this.currentSpotIndex = 0;       // 當前景點索引
        this.map = null;                 // Leaflet 地圖實例
        this.markers = [];               // 地圖標記陣列
        this.bottomSheet = null;         // 底部抽屜元素
        this.isExpanded = false;         // 抽屜展開狀態

        this.init(mapElement);
    }

    init(mapElement) {
        this.initMap(mapElement);
        this.initBottomSheet();
        this.initGestureHandlers();
        this.renderSpots();
        this.focusSpot(0);
    }

    initMap(mapElement) {
        // 初始化 Leaflet 地圖
        this.map = L.map(mapElement).setView(
            this.spots[0].coords,
            14
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        // 添加自訂標記
        this.createNumberedMarkers();
    }

    createNumberedMarkers() {
        this.spots.forEach((spot, index) => {
            const markerIcon = L.divIcon({
                html: `
                    <div class="custom-marker">
                        <div class="marker-number">${index + 1}</div>
                        <div class="marker-icon">${spot.icon}</div>
                    </div>
                `,
                className: 'numbered-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });

            const marker = L.marker(spot.coords, { icon: markerIcon })
                .addTo(this.map);

            marker.on('click', () => this.focusSpot(index));
            this.markers.push(marker);
        });

        // 繪製路徑
        this.drawRoute();
    }

    drawRoute() {
        const coordinates = this.spots.map(s => s.coords);
        L.polyline(coordinates, {
            color: '#FF8C00',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(this.map);
    }

    initBottomSheet() {
        // 創建底部抽屜 DOM
        this.bottomSheet = document.querySelector('.bottom-sheet');

        // 把手拖曳處理
        const handle = this.bottomSheet.querySelector('.sheet-handle');
        let startY, startHeight;

        handle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startHeight = this.bottomSheet.offsetHeight;
        });

        handle.addEventListener('touchmove', (e) => {
            const deltaY = startY - e.touches[0].clientY;
            const newHeight = startHeight + deltaY;
            this.bottomSheet.style.height = `${newHeight}px`;
        });

        handle.addEventListener('touchend', () => {
            // 根據位置判斷要收起或展開
            const threshold = window.innerHeight * 0.5;
            if (this.bottomSheet.offsetHeight > threshold) {
                this.expandSheet();
            } else {
                this.collapseSheet();
            }
        });
    }

    expandSheet() {
        this.bottomSheet.classList.add('expanded');
        this.isExpanded = true;
    }

    collapseSheet() {
        this.bottomSheet.classList.remove('expanded');
        this.isExpanded = false;
    }

    initGestureHandlers() {
        const spotCards = document.querySelectorAll('.spot-card');
        let touchStartX = 0;

        spotCards.forEach((card, index) => {
            // 點擊切換焦點
            card.addEventListener('click', () => {
                this.focusSpot(index);
            });

            // 左右滑動切換景點
            card.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });

            card.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        // 左滑 - 下一個
                        this.nextSpot();
                    } else {
                        // 右滑 - 上一個
                        this.prevSpot();
                    }
                }
            });
        });
    }

    focusSpot(index) {
        this.currentSpotIndex = index;
        const spot = this.spots[index];

        // 地圖平移至該景點
        this.map.setView(spot.coords, 15, {
            animate: true,
            duration: 0.5
        });

        // 更新卡片 active 狀態
        document.querySelectorAll('.spot-card').forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        // 滾動到該卡片
        const activeCard = document.querySelectorAll('.spot-card')[index];
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    nextSpot() {
        if (this.currentSpotIndex < this.spots.length - 1) {
            this.focusSpot(this.currentSpotIndex + 1);
        }
    }

    prevSpot() {
        if (this.currentSpotIndex > 0) {
            this.focusSpot(this.currentSpotIndex - 1);
        }
    }

    openNavigation(app) {
        const spot = this.spots[this.currentSpotIndex];
        const [lat, lng] = spot.coords;

        const urls = {
            'google': `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
            'apple': `maps://maps.apple.com/?daddr=${lat},${lng}`,
            'uber': `uber://?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`
        };

        window.open(urls[app], '_blank');
    }
}
```

---

## Phase 2: 互動地圖導覽功能 (Week 3-4)

### 2.1 自訂地圖標記

**標記樣式** (`css/navigation.css`):
```css
.numbered-marker {
    position: relative;
}

.custom-marker {
    position: relative;
    width: 40px;
    height: 40px;
}

.marker-number {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.marker-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
```

### 2.2 底部抽屜景點卡片

**卡片結構**:
```html
<div class="bottom-sheet">
    <div class="sheet-handle"></div>

    <div class="sheet-header">
        <h3>行程景點</h3>
        <div class="spot-progress">1 / 5</div>
    </div>

    <div class="spot-cards-container">
        <!-- 可左右滑動的景點卡片 -->
        <div class="spot-card active">
            <div class="spot-header">
                <div class="spot-number">1</div>
                <div class="spot-info">
                    <h4 class="spot-name">🛬 那霸機場</h4>
                    <div class="spot-meta">
                        <span class="spot-time">09:20 抵達</span>
                        <span class="spot-duration">停留 30 分鐘</span>
                    </div>
                </div>
            </div>

            <div class="spot-description">
                那覇空港（OKA）抵達，提領行李後前往 PARCO CITY
            </div>

            <div class="spot-transport">
                <div class="transport-icon">🚕</div>
                <div class="transport-info">
                    <div class="transport-type">計程車</div>
                    <div class="transport-detail">20 分鐘 · 約 ¥2,000</div>
                </div>
            </div>

            <div class="nav-actions">
                <button class="btn-navigate" onclick="nav.openNavigation('google')">
                    <span>📍</span> Google 導航
                </button>
                <button class="btn-navigate btn-secondary" onclick="nav.openNavigation('apple')">
                    <span>🗺️</span> Apple 地圖
                </button>
            </div>
        </div>

        <!-- 更多景點卡片... -->
    </div>
</div>
```

---

## Phase 3: 進階功能實作 (Week 5-6)

### 3.1 動態時間軸與距離計算

```javascript
class RouteCalculator {
    static async calculateRoute(start, end, mode = 'driving') {
        // 使用 OpenRouteService API (免費替代方案)
        const apiKey = 'YOUR_API_KEY'; // 需要註冊
        const url = `https://api.openrouteservice.org/v2/directions/${mode}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({
                coordinates: [[start.lng, start.lat], [end.lng, end.lat]]
            })
        });

        const data = await response.json();
        return {
            distance: data.routes[0].summary.distance,     // 公尺
            duration: data.routes[0].summary.duration      // 秒
        };
    }
}
```

### 3.2 視圖切換功能

**切換按鈕**:
```html
<div class="view-toggle">
    <button class="toggle-btn active" data-view="map">
        🗺️ 地圖
    </button>
    <button class="toggle-btn" data-view="list">
        📋 清單
    </button>
</div>
```

**切換邏輯**:
```javascript
class ViewManager {
    constructor() {
        this.currentView = 'map';
        this.initToggle();
    }

    initToggle() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        this.currentView = view;

        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        if (view === 'map') {
            document.querySelector('.nav-map-container').style.display = 'block';
            document.querySelector('.bottom-sheet').style.display = 'block';
            document.querySelector('.timeline-list-view').style.display = 'none';
        } else {
            document.querySelector('.nav-map-container').style.display = 'none';
            document.querySelector('.bottom-sheet').style.display = 'none';
            document.querySelector('.timeline-list-view').style.display = 'block';
        }
    }
}
```

---

## Phase 4: 易用性優化 (Week 7)

### 4.1 高對比模式

```css
@media (prefers-contrast: high) {
    :root {
        --color-text-primary: #000000;
        --color-background: #FFFFFF;
    }

    .btn-navigate {
        border: 2px solid #000000;
    }
}

/* 陽光模式強化對比 */
.sunlight-mode {
    --color-text-primary: #000000;
    --color-background: #FFFFFF;
    filter: contrast(1.2) brightness(1.1);
}
```

### 4.2 單手操作優化

```css
/* 拇指區域 (下方 1/3 螢幕) */
.thumb-zone {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 33vh;
    pointer-events: none;
}

.thumb-zone * {
    pointer-events: auto;
}

/* 重要按鈕置於底部 */
.nav-actions {
    position: sticky;
    bottom: 20px;
    z-index: 100;
}
```

---

## 檔案結構

```
stuck-in-kokusai-street/
├── css/
│   ├── navigation.css        # 新增：導覽模式樣式
│   ├── funliday-theme.css    # 新增：Funliday 配色主題
│   └── variables.css         # 更新：新增導覽變數
├── js/
│   ├── navigation.js         # 新增：導覽模式核心
│   ├── route-calculator.js   # 新增：路徑計算
│   └── view-manager.js       # 新增：視圖管理
├── day1.html                 # 更新：加入導覽模式
├── day2.html                 # 更新：加入導覽模式
├── day3.html                 # 更新：加入導覽模式
└── day4.html                 # 更新：加入導覽模式
```

---

## 技術堆疊

- **地圖**: Leaflet.js + OpenStreetMap
- **路徑計算**: OpenRouteService API (免費)
- **手勢**: Touch Events API (原生)
- **動畫**: CSS Transitions + Web Animations API
- **離線**: Service Worker + Cache API

---

## 測試檢查清單

- [ ] 地圖標記正確顯示數字編號
- [ ] 底部抽屜可上下拖曳
- [ ] 左右滑動可切換景點
- [ ] 地圖自動平移至當前景點
- [ ] 導航按鈕正確跳轉外部 App
- [ ] 地圖/清單視圖切換正常
- [ ] 高對比模式在戶外可讀
- [ ] 所有重要按鈕在拇指區域內
- [ ] 觸控反饋及時準確

---

## 下一步行動

1. **確認是否開始實作**
2. **決定從哪個 Phase 開始**（建議從 Phase 1 基礎架構）
3. **選擇要先實作哪一天的行程**（建議 Day 1 作為原型）

準備好開始了嗎？ 🚀
