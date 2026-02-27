// Map.js - Leaflet.js 地圖整合（使用免費 OpenStreetMap）

// 沖繩景點座標資料
const locations = {
    // 住宿
    hotelLantama: {
        name: 'Hotel Lantama',
        coords: [26.2144, 127.6809],
        type: 'hotel',
        description: '那霸飯店，鄰近國際通',
        icon: '🏨'
    },

    // Day 1 景點
    nahaAirport: {
        name: '那霸機場',
        coords: [26.1958, 127.6462],
        type: 'transport',
        description: '沖繩那霸機場',
        icon: '✈️',
        day: 1
    },
    parcoCity: {
        name: 'PARCO CITY',
        coords: [26.2454, 127.7202],
        type: 'shopping',
        description: '大型購物中心，靠海景觀絕佳',
        icon: '🏬',
        day: 1
    },
    kokusaiStreet: {
        name: '國際通',
        coords: [26.2175, 127.6789],
        type: 'shopping',
        description: '沖繩最熱鬧的商店街',
        icon: '🎊',
        day: 1
    },
    donkiKokusai: {
        name: '唐吉訶德 國際通店',
        coords: [26.2168, 127.6795],
        type: 'shopping',
        description: '深夜營業藥妝店',
        icon: '🛒',
        day: 1
    },

    // Day 2 選項 A - 北部
    chumiOquarium: {
        name: '美麗海水族館',
        coords: [26.6943, 127.8772],
        type: 'attraction',
        description: '世界級水族館，黑潮之海',
        icon: '🐠',
        day: 2,
        option: 'A'
    },
    oceanExpoPark: {
        name: '海洋博公園',
        coords: [26.6950, 127.8780],
        type: 'park',
        description: '大型海洋主題公園',
        icon: '🌊',
        day: 2,
        option: 'A'
    },
    biseFukugi: {
        name: '備瀨福木林道',
        coords: [26.7015, 127.8825],
        type: 'nature',
        description: '美麗的福木林道',
        icon: '🌳',
        day: 2,
        option: 'A'
    },

    // Day 2 選項 B - 南部
    shuriCastle: {
        name: '首里城',
        coords: [26.2172, 127.7195],
        type: 'culture',
        description: '琉球王國世界文化遺產',
        icon: '🏯',
        day: 2,
        option: 'B'
    },
    shikinaen: {
        name: '識名園',
        coords: [26.1977, 127.7158],
        type: 'garden',
        description: '琉球王家別苑',
        icon: '🏞️',
        day: 2,
        option: 'B'
    },
    seifaUtaki: {
        name: '齋場御嶽',
        coords: [26.1682, 127.8289],
        type: 'culture',
        description: '神聖祈禱場所',
        icon: '⛩️',
        day: 2,
        option: 'B'
    },
    chinenCape: {
        name: '知念岬公園',
        coords: [26.1657, 127.8341],
        type: 'viewpoint',
        description: '絕美海景',
        icon: '🌅',
        day: 2,
        option: 'B'
    },

    // Day 2 選項 C - 中部
    americanVillage: {
        name: '美國村',
        coords: [26.3158, 127.7597],
        type: 'shopping',
        description: '美式風情購物區',
        icon: '🎡',
        day: 2,
        option: 'C'
    },
    aeonMall: {
        name: 'AEON Mall',
        coords: [26.3350, 127.8050],
        type: 'shopping',
        description: '永旺夢樂城',
        icon: '🏬',
        day: 2,
        option: 'C'
    },
    sunsetBeach: {
        name: '日落海灘',
        coords: [26.3130, 127.7570],
        type: 'beach',
        description: '美麗的夕陽海灘',
        icon: '🏖️',
        day: 2,
        option: 'C'
    },

    // Day 3 景點
    naminoueShrine: {
        name: '波上宮',
        coords: [26.2145, 127.6628],
        type: 'shrine',
        description: '琉球八社之一',
        icon: '⛩️',
        day: 3
    },
    naminoueBeach: {
        name: '波之上海灘',
        coords: [26.2138, 127.6625],
        type: 'beach',
        description: '那霸市內唯一海灘',
        icon: '🏖️',
        day: 3
    },
    tomariPort: {
        name: '泊港漁市場',
        coords: [26.2245, 127.6710],
        type: 'market',
        description: '在地漁市場',
        icon: '🐟',
        day: 3
    },

    // Day 4 景點
    makishiMarket: {
        name: '第一牧志公設市場',
        coords: [26.2165, 127.6802],
        type: 'market',
        description: '沖繩的市民廚房',
        icon: '🦐',
        day: 4
    },
    senagajima: {
        name: '瀨長島',
        coords: [26.1850, 127.6487],
        type: 'island',
        description: '離機場最近的離島',
        icon: '🏝️',
        day: 4
    },
    umikajiTerrace: {
        name: 'Umikaji Terrace',
        coords: [26.1845, 127.6490],
        type: 'shopping',
        description: '白色地中海風建築',
        icon: '☕',
        day: 4
    },
    iiasToyosaki: {
        name: 'iias 豐崎',
        coords: [26.1755, 127.6542],
        type: 'shopping',
        description: '大型購物中心',
        icon: '🛍️',
        day: 4
    }
};

// 顏色配置（對應每一天）
const dayColors = {
    1: '#FF6B6B',  // 紅色 - Day 1
    2: '#4ECDC4',  // 青色 - Day 2
    3: '#FFD93D',  // 黃色 - Day 3
    4: '#6BCF7F',  // 綠色 - Day 4
    hotel: '#2C3E50',  // 深藍 - 飯店
    transport: '#95A5A6'  // 灰色 - 交通
};

// 自訂 Marker Icon（使用 emoji）
function createCustomIcon(emoji, color) {
    return L.divIcon({
        html: `<div style="
            background-color: ${color};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        ">${emoji}</div>`,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });
}

// 初始化地圖（行程總覽頁面）
function initItineraryMap() {
    const mapElement = document.getElementById('itineraryMap');
    if (!mapElement) return;

    // 建立地圖，中心點設在沖繩中部
    const map = L.map('itineraryMap').setView([26.3344, 127.8056], 10);

    // 使用 OpenStreetMap 圖磚（免費）
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 標記所有景點
    Object.keys(locations).forEach(key => {
        const loc = locations[key];
        const color = loc.day ? dayColors[loc.day] : dayColors[loc.type] || '#95A5A6';
        const marker = L.marker(loc.coords, {
            icon: createCustomIcon(loc.icon, color)
        }).addTo(map);

        // Popup 內容
        let popupContent = `
            <div style="font-family: 'Patrick Hand', cursive; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
        `;

        if (loc.day) {
            popupContent += `<p style="margin: 0; font-size: 12px; color: #718096;">📅 Day ${loc.day}</p>`;
        }
        if (loc.option) {
            popupContent += `<p style="margin: 0; font-size: 12px; color: #718096;">🎯 選項 ${loc.option}</p>`;
        }

        popupContent += '</div>';

        marker.bindPopup(popupContent);
    });

    // 繪製路線（Day 1）
    const day1Route = [
        locations.nahaAirport.coords,
        locations.parcoCity.coords,
        locations.hotelLantama.coords,
        locations.kokusaiStreet.coords
    ];
    L.polyline(day1Route, {
        color: dayColors[1],
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    // 繪製路線（Day 3）
    const day3Route = [
        locations.hotelLantama.coords,
        locations.naminoueShrine.coords,
        locations.tomariPort.coords,
        locations.hotelLantama.coords
    ];
    L.polyline(day3Route, {
        color: dayColors[3],
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    // 繪製路線（Day 4）
    const day4Route = [
        locations.hotelLantama.coords,
        locations.makishiMarket.coords,
        locations.senagajima.coords,
        locations.iiasToyosaki.coords,
        locations.nahaAirport.coords
    ];
    L.polyline(day4Route, {
        color: dayColors[4],
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    return map;
}

// 初始化 Day 1 地圖
function initDay1Map() {
    const mapElement = document.getElementById('day1Map');
    if (!mapElement) return;

    const map = L.map('day1Map').setView([26.2300, 127.6800], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 標記 Day 1 景點
    const day1Locations = ['nahaAirport', 'parcoCity', 'hotelLantama', 'kokusaiStreet', 'donkiKokusai'];

    day1Locations.forEach(key => {
        const loc = locations[key];
        const marker = L.marker(loc.coords, {
            icon: createCustomIcon(loc.icon, dayColors[1])
        }).addTo(map);

        marker.bindPopup(`
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
            </div>
        `);
    });

    // 繪製路線
    const route = day1Locations.map(key => locations[key].coords);
    L.polyline(route, {
        color: dayColors[1],
        weight: 4,
        opacity: 0.7
    }).addTo(map);

    return map;
}

// 初始化 Day 2 地圖（三個選項）
function initDay2Map(option = 'A') {
    const mapElement = document.getElementById('day2Map');
    if (!mapElement) return;

    let centerCoords, zoomLevel;

    // 根據選項設定地圖中心和縮放
    if (option === 'A') {
        centerCoords = [26.6943, 127.8772];  // 美麗海水族館
        zoomLevel = 10;
    } else if (option === 'B') {
        centerCoords = [26.2000, 127.7500];  // 南部
        zoomLevel = 11;
    } else {
        centerCoords = [26.3158, 127.7597];  // 美國村
        zoomLevel = 12;
    }

    const map = L.map('day2Map').setView(centerCoords, zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 找出對應選項的景點
    const optionLocations = Object.keys(locations).filter(key =>
        locations[key].day === 2 && locations[key].option === option
    );

    optionLocations.forEach(key => {
        const loc = locations[key];
        const marker = L.marker(loc.coords, {
            icon: createCustomIcon(loc.icon, dayColors[2])
        }).addTo(map);

        marker.bindPopup(`
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
                <p style="margin: 0; font-size: 12px; color: #718096;">
                    🎯 選項 ${option}
                </p>
            </div>
        `);
    });

    // 繪製路線（如果有多個景點）
    if (optionLocations.length > 1) {
        const route = optionLocations.map(key => locations[key].coords);
        L.polyline(route, {
            color: dayColors[2],
            weight: 4,
            opacity: 0.7
        }).addTo(map);
    }

    return map;
}

// 初始化 Day 3 地圖
function initDay3Map() {
    const mapElement = document.getElementById('day3Map');
    if (!mapElement) return;

    const map = L.map('day3Map').setView([26.2195, 127.6670], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 標記 Day 3 景點
    const day3Locations = ['hotelLantama', 'naminoueShrine', 'naminoueBeach', 'tomariPort'];

    day3Locations.forEach(key => {
        const loc = locations[key];
        const color = key === 'hotelLantama' ? dayColors.hotel : dayColors[3];
        const marker = L.marker(loc.coords, {
            icon: createCustomIcon(loc.icon, color)
        }).addTo(map);

        marker.bindPopup(`
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
            </div>
        `);
    });

    // 繪製路線
    const route = day3Locations.map(key => locations[key].coords);
    L.polyline(route, {
        color: dayColors[3],
        weight: 4,
        opacity: 0.7
    }).addTo(map);

    return map;
}

// 初始化 Day 4 地圖
function initDay4Map() {
    const mapElement = document.getElementById('day4Map');
    if (!mapElement) return;

    const map = L.map('day4Map').setView([26.1950, 127.6650], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 標記 Day 4 景點
    const day4Locations = ['hotelLantama', 'makishiMarket', 'senagajima', 'umikajiTerrace', 'iiasToyosaki', 'nahaAirport'];

    day4Locations.forEach(key => {
        const loc = locations[key];
        let color;
        if (key === 'hotelLantama') color = dayColors.hotel;
        else if (key === 'nahaAirport') color = dayColors.transport;
        else color = dayColors[4];

        const marker = L.marker(loc.coords, {
            icon: createCustomIcon(loc.icon, color)
        }).addTo(map);

        marker.bindPopup(`
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
            </div>
        `);
    });

    // 繪製路線
    const route = day4Locations.map(key => locations[key].coords);
    L.polyline(route, {
        color: dayColors[4],
        weight: 4,
        opacity: 0.7
    }).addTo(map);

    return map;
}

// 頁面載入後初始化地圖
document.addEventListener('DOMContentLoaded', function() {
    // 檢查當前頁面並初始化對應地圖
    if (document.getElementById('itineraryMap')) {
        initItineraryMap();
    }
    if (document.getElementById('day1Map')) {
        initDay1Map();
    }
    if (document.getElementById('day2Map')) {
        // 預設顯示選項 A
        initDay2Map('A');

        // 如果有選項切換按鈕
        const optionBtns = document.querySelectorAll('.day2-option-btn');
        if (optionBtns.length > 0) {
            optionBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const option = this.dataset.option;
                    // 移除舊地圖
                    document.getElementById('day2Map').innerHTML = '';
                    // 重新初始化
                    initDay2Map(option);
                });
            });
        }
    }
    if (document.getElementById('day3Map')) {
        initDay3Map();
    }
    if (document.getElementById('day4Map')) {
        initDay4Map();
    }
});
