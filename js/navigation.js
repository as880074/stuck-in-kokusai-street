/**
 * NavigationMode - 互動導覽模式核心類別
 * 提供地圖導覽、景點切換、手勢操作等功能
 */

class NavigationMode {
    constructor(spots, config = {}) {
        // 景點資料
        this.spots = spots;
        this.currentSpotIndex = 0;

        // 配置選項
        this.config = {
            mapElement: config.mapElement || 'navMap',
            containerElement: config.containerElement || null,
            initialZoom: config.initialZoom || 14,
            routeColor: config.routeColor || '#FF8C00',
            ...config
        };

        // DOM 元素引用
        this.mapElement = null;
        this.bottomSheet = null;
        this.spotCards = [];

        // Leaflet 實例
        this.map = null;
        this.markers = [];
        this.routePolyline = null;

        // 狀態
        this.isExpanded = false;
        this.isTransitioning = false;
        this.currentView = 'map'; // 'map' or 'list'

        // 手勢處理
        this.touchStartY = 0;
        this.touchStartHeight = 0;
        this.touchStartX = 0;
    }

    /**
     * 初始化導覽模式
     */
    async init() {
        try {
            await this.initMap();
            this.initBottomSheet();
            this.initGestureHandlers();
            this.initViewToggle();
            this.renderSpots();
            this.focusSpot(0);

            console.log('✅ NavigationMode initialized successfully');
        } catch (error) {
            console.error('❌ NavigationMode initialization failed:', error);
            throw error;
        }
    }

    /**
     * 初始化 Leaflet 地圖
     */
    async initMap() {
        this.mapElement = document.getElementById(this.config.mapElement);
        if (!this.mapElement) {
            throw new Error(`Map element #${this.config.mapElement} not found`);
        }

        // 創建地圖實例
        const firstSpot = this.spots[0];
        this.map = L.map(this.mapElement, {
            zoomControl: false, // 移除預設縮放控制
            attributionControl: true
        }).setView(firstSpot.coords, this.config.initialZoom);

        // 添加 OpenStreetMap 圖層
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            minZoom: 10
        }).addTo(this.map);

        // 添加縮放控制（右下角）
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        // 創建標記和路徑
        this.createNumberedMarkers();
        this.drawRoute();

        // 等待地圖渲染完成
        await new Promise(resolve => setTimeout(resolve, 100));
        this.map.invalidateSize();
    }

    /**
     * 創建數字標記
     */
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
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            const marker = L.marker(spot.coords, {
                icon: markerIcon,
                title: spot.name
            }).addTo(this.map);

            // 點擊標記切換焦點
            marker.on('click', () => {
                this.focusSpot(index);
                this.collapseSheet(); // 點擊地圖標記時收起抽屜
            });

            this.markers.push(marker);
        });
    }

    /**
     * 繪製路徑
     */
    drawRoute() {
        const coordinates = this.spots.map(s => s.coords);

        this.routePolyline = L.polyline(coordinates, {
            color: this.config.routeColor,
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(this.map);

        // 調整地圖視野以包含所有路徑
        // this.map.fitBounds(this.routePolyline.getBounds(), { padding: [50, 50] });
    }

    /**
     * 初始化底部抽屜
     */
    initBottomSheet() {
        this.bottomSheet = document.querySelector('.bottom-sheet');
        if (!this.bottomSheet) {
            console.warn('Bottom sheet element not found');
            return;
        }

        const handle = this.bottomSheet.querySelector('.sheet-handle-container');
        if (!handle) return;

        // 觸控開始
        handle.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartHeight = this.bottomSheet.offsetHeight;
            this.bottomSheet.classList.remove('transitioning');
        }, { passive: true });

        // 觸控移動
        handle.addEventListener('touchmove', (e) => {
            if (this.isTransitioning) return;

            const currentY = e.touches[0].clientY;
            const deltaY = this.touchStartY - currentY;
            const newHeight = Math.max(
                window.innerHeight * 0.33,
                Math.min(
                    window.innerHeight * 0.9,
                    this.touchStartHeight + deltaY
                )
            );

            this.bottomSheet.style.height = `${newHeight}px`;
        }, { passive: true });

        // 觸控結束
        handle.addEventListener('touchend', () => {
            this.bottomSheet.classList.add('transitioning');

            const threshold = window.innerHeight * 0.5;
            if (this.bottomSheet.offsetHeight > threshold) {
                this.expandSheet();
            } else {
                this.collapseSheet();
            }
        }, { passive: true });

        // 點擊把手切換展開/收起
        handle.addEventListener('click', () => {
            if (this.isExpanded) {
                this.collapseSheet();
            } else {
                this.expandSheet();
            }
        });
    }

    /**
     * 展開抽屜
     */
    expandSheet() {
        if (!this.bottomSheet) return;

        this.isExpanded = true;
        this.bottomSheet.classList.add('expanded');
        this.bottomSheet.style.height = ''; // 使用 CSS 類別控制
    }

    /**
     * 收起抽屜
     */
    collapseSheet() {
        if (!this.bottomSheet) return;

        this.isExpanded = false;
        this.bottomSheet.classList.remove('expanded');
        this.bottomSheet.style.height = ''; // 使用 CSS 類別控制
    }

    /**
     * 初始化手勢處理
     */
    initGestureHandlers() {
        const container = document.querySelector('.spot-cards-container');
        if (!container) return;

        this.spotCards = container.querySelectorAll('.spot-card');

        this.spotCards.forEach((card, index) => {
            // 點擊切換焦點
            card.addEventListener('click', (e) => {
                // 排除按鈕點擊
                if (e.target.closest('.btn-navigate')) return;

                this.focusSpot(index);
            });

            // 左右滑動切換景點
            card.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            }, { passive: true });

            card.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = this.touchStartX - touchEndX;

                // 滑動距離超過 50px 才觸發
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSpot();
                    } else {
                        this.prevSpot();
                    }
                }
            }, { passive: true });
        });
    }

    /**
     * 初始化視圖切換
     */
    initViewToggle() {
        const toggleButtons = document.querySelectorAll('.view-toggle-btn');

        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });
    }

    /**
     * 切換視圖 (地圖/清單)
     */
    switchView(view) {
        this.currentView = view;

        // 更新按鈕狀態
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // 切換顯示
        const mapContainer = document.querySelector('.nav-map-container');
        const bottomSheet = document.querySelector('.bottom-sheet');
        const listView = document.querySelector('.timeline-list-view');

        if (view === 'map') {
            if (mapContainer) mapContainer.style.display = 'block';
            if (bottomSheet) bottomSheet.style.display = 'flex';
            if (listView) listView.style.display = 'none';

            // 重新計算地圖大小
            if (this.map) {
                setTimeout(() => this.map.invalidateSize(), 100);
            }
        } else if (view === 'list') {
            if (mapContainer) mapContainer.style.display = 'none';
            if (bottomSheet) bottomSheet.style.display = 'none';
            if (listView) listView.style.display = 'block';
        }
    }

    /**
     * 渲染景點卡片
     */
    renderSpots() {
        const container = document.querySelector('.spot-cards-container');
        if (!container) return;

        // 更新進度顯示
        this.updateProgress();
    }

    /**
     * 更新進度顯示
     */
    updateProgress() {
        const progressEl = document.querySelector('.spot-progress');
        if (progressEl) {
            progressEl.innerHTML = `
                <span class="spot-progress-current">${this.currentSpotIndex + 1}</span>
                <span> / ${this.spots.length}</span>
            `;
        }
    }

    /**
     * 聚焦到指定景點
     */
    focusSpot(index) {
        if (index < 0 || index >= this.spots.length) return;

        this.currentSpotIndex = index;
        const spot = this.spots[index];

        // 地圖平移至該景點
        if (this.map) {
            this.map.setView(spot.coords, 15, {
                animate: true,
                duration: 0.5,
                easeLinearity: 0.25
            });
        }

        // 更新卡片 active 狀態
        this.spotCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        // 滾動到該卡片
        const activeCard = this.spotCards[index];
        if (activeCard) {
            activeCard.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        // 更新進度
        this.updateProgress();
    }

    /**
     * 下一個景點
     */
    nextSpot() {
        if (this.currentSpotIndex < this.spots.length - 1) {
            this.focusSpot(this.currentSpotIndex + 1);
        }
    }

    /**
     * 上一個景點
     */
    prevSpot() {
        if (this.currentSpotIndex > 0) {
            this.focusSpot(this.currentSpotIndex - 1);
        }
    }

    /**
     * 開啟外部導航 App
     */
    openNavigation(app = 'google') {
        const spot = this.spots[this.currentSpotIndex];
        const [lat, lng] = spot.coords;
        const name = encodeURIComponent(spot.nameJa || spot.name);

        const urls = {
            google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`,
            apple: `maps://maps.apple.com/?daddr=${lat},${lng}&q=${name}`,
            uber: `uber://?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${name}`
        };

        const url = urls[app] || urls.google;

        // 在新視窗開啟
        window.open(url, '_blank', 'noopener,noreferrer');

        console.log(`📍 Opening ${app} navigation to:`, spot.name);
    }

    /**
     * 銷毀導覽模式
     */
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        this.markers = [];
        this.routePolyline = null;
        this.spotCards = [];

        console.log('🗑️ NavigationMode destroyed');
    }
}

// 全域匯出
window.NavigationMode = NavigationMode;
