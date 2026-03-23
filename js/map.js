// Map.js - Leaflet.js 地圖整合（使用免費 OpenStreetMap）

// 生成 Google Maps 連結
function getGoogleMapsUrl(coords, name, nameJa) {
    const lat = coords[0];
    const lng = coords[1];
    // 優先使用日文名稱，若無則使用中文名稱
    const searchName = nameJa || name;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(searchName)}`;
}

// 沖繩景點座標資料
const locations = {
    // 住宿
    hotelLantama: {
        name: 'Hotel Lantana 那霸國際通',
        nameJa: 'ホテルランタナ那覇国際通り',
        coords: [26.2144, 127.6809],
        type: 'hotel',
        description: '位於國際通中心，下樓即達熱鬧街區',
        icon: '🏨'
    },

    // Day 1 景點
    nahaAirport: {
        name: '那霸機場',
        nameJa: '那覇空港',
        coords: [26.1958, 127.6462],
        type: 'transport',
        description: '沖繩那霸機場',
        icon: '✈️',
        day: 1
    },
    parcoCity: {
        name: 'San-A Urasoe West Coast PARCO CITY',
        nameJa: 'サンエー浦添西海岸パルコシティ',
        coords: [26.26259, 127.69878],
        type: 'shopping',
        description: '沖繩最新最大購物商場，面向大海景觀極佳',
        icon: '🏬',
        day: 1
    },
    kokusaiStreet: {
        name: '國際通',
        nameJa: '国際通り',
        coords: [26.2175, 127.6789],
        type: 'shopping',
        description: '沖繩最熱鬧的商店街',
        icon: '🎊',
        day: 1
    },
    donkiKokusai: {
        name: '唐吉訶德 國際通店',
        nameJa: 'ドン・キホーテ国際通り店',
        coords: [26.2168, 127.6795],
        type: 'shopping',
        description: '深夜營業藥妝店',
        icon: '🛒',
        day: 1
    },

    // Day 2 - 北部一日遊路線
    ryuboDepStore: {
        name: 'RYUBO 百貨集合點',
        nameJa: 'リウボウ',
        coords: [26.2133, 127.6790],
        type: 'meeting',
        description: 'Easy Go 導遊團集合點（BLUE SEAL 店鋪前）',
        icon: '🚩',
        day: 2
    },
    manzaMou: {
        name: '萬座毛',
        nameJa: '万座毛',
        coords: [26.5052353, 127.8504781],
        type: 'attraction',
        description: '標誌性的象鼻岩與壯闊斷崖',
        icon: '🐘',
        day: 2
    },
    kouriIsland: {
        name: '古宇利島',
        nameJa: '古宇利島',
        coords: [26.68706, 128.01756],
        type: 'island',
        description: '壯觀的古宇利大橋與美麗海灘',
        icon: '🌉',
        day: 2
    },
    chumiOquarium: {
        name: '美麗海水族館',
        nameJa: '沖縄美ら海水族館',
        coords: [26.694338, 127.8780131],
        type: 'attraction',
        description: '世界級水族館，黑潮之海與鯨鯊',
        icon: '🐠',
        day: 2
    },
    americanVillage: {
        name: '美國村（北谷）',
        nameJa: '美浜アメリカンビレッジ',
        coords: [26.315851, 127.757669],
        type: 'shopping',
        description: '美式風情購物區，導遊團解散點',
        icon: '🎡',
        day: 2
    },
    aeonRycom: {
        name: 'AEON MALL 永旺夢樂城',
        nameJa: 'イオンモール沖縄ライカム',
        coords: [26.31404, 127.79585],
        type: 'shopping',
        description: '沖繩最大購物中心，寶可夢中心在此',
        icon: '🛍️',
        day: 2
    },

    // Day 3 景點
    naminoueShrine: {
        name: '波上宮',
        nameJa: '波上宮',
        coords: [26.2145, 127.6693],
        type: 'shrine',
        description: '琉球八社之一',
        icon: '⛩️',
        day: 3
    },
    naminoueBeach: {
        name: '波之上海灘',
        nameJa: '波の上ビーチ',
        coords: [26.2138, 127.6625],
        type: 'beach',
        description: '那霸市內唯一海灘',
        icon: '🏖️',
        day: 3
    },
    tomariPort: {
        name: '泊港漁市場',
        nameJa: '泊いゆまち',
        coords: [26.2245, 127.6710],
        type: 'market',
        description: '在地漁市場',
        icon: '🐟',
        day: 3
    },

    // Day 4 景點
    makishiMarket: {
        name: '第一牧志公設市場',
        nameJa: '第一牧志公設市場',
        coords: [26.2165, 127.6802],
        type: 'market',
        description: '沖繩的市民廚房',
        icon: '🦐',
        day: 4
    },
    senagajima: {
        name: '瀨長島',
        nameJa: '瀬長島',
        coords: [26.1850, 127.6487],
        type: 'island',
        description: '離機場最近的離島',
        icon: '🏝️',
        day: 4
    },
    umikajiTerrace: {
        name: 'Umikaji Terrace',
        nameJa: '瀬長島ウミカジテラス',
        coords: [26.1845, 127.6490],
        type: 'shopping',
        description: '白色地中海風建築',
        icon: '☕',
        day: 4
    },
    iiasToyosaki: {
        name: 'iias 豐崎',
        nameJa: 'iias沖縄豊崎',
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
        const googleMapsUrl = getGoogleMapsUrl(loc.coords, loc.name, loc.nameJa);
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
            popupContent += `<p style="margin: 0 0 4px 0; font-size: 12px; color: #718096;">📅 Day ${loc.day}</p>`;
        }
        if (loc.option) {
            popupContent += `<p style="margin: 0 0 4px 0; font-size: 12px; color: #718096;">🎯 選項 ${loc.option}</p>`;
        }

        popupContent += `
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; margin-top: 8px; padding: 6px 12px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    📍 在 Google Maps 中打開
                </a>
            </div>
        `;

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

        const googleMapsUrl = getGoogleMapsUrl(loc.coords, loc.name, loc.nameJa);
        marker.bindPopup(`
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; margin-top: 8px; padding: 6px 12px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    📍 在 Google Maps 中打開
                </a>
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

// 初始化 Day 2 地圖（北部一日遊 + 永旺購物）
function initDay2Map() {
    const mapElement = document.getElementById('day2Map');
    if (!mapElement) return;

    // 地圖中心設在沖繩中北部
    const map = L.map('day2Map').setView([26.4500, 127.8300], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Day 2 行程景點
    const day2Locations = [
        'hotelLantama',      // 起點
        'ryuboDepStore',     // 集合點
        'manzaMou',          // 萬座毛
        'kouriIsland',       // 古宇利島
        'chumiOquarium',     // 美麗海水族館
        'americanVillage',   // 美國村（脫隊點）
        'aeonRycom',         // 永旺夢樂城
        'hotelLantama'       // 返回飯店
    ];

    day2Locations.forEach((key, index) => {
        const loc = locations[key];
        if (!loc) return;

        // 根據不同景點類型使用不同顏色
        let color;
        if (key === 'hotelLantama') {
            color = dayColors.hotel;
        } else if (key === 'ryuboDepStore') {
            color = '#E74C3C';  // 紅色標記集合點
        } else if (key === 'aeonRycom') {
            color = '#F39C12';  // 橘色標記購物中心
        } else {
            color = dayColors[2];
        }

        const marker = L.marker(loc.coords, {
            icon: createCustomIcon(loc.icon, color)
        }).addTo(map);

        const googleMapsUrl = getGoogleMapsUrl(loc.coords, loc.name, loc.nameJa);
        let popupContent = `
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
        `;

        // 添加順序標記
        if (index > 0 && index < day2Locations.length - 1) {
            popupContent += `<p style="margin: 0 0 4px 0; font-size: 12px; color: #718096;">📍 第 ${index} 站</p>`;
        }

        popupContent += `
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; margin-top: 8px; padding: 6px 12px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    📍 在 Google Maps 中打開
                </a>
            </div>
        `;
        marker.bindPopup(popupContent);
    });

    // 繪製路線 - 分成兩段
    // 第一段：導遊團路線（那霸 → 美國村）
    const tourRoute = [
        locations.hotelLantama.coords,
        locations.manzaMou.coords,
        locations.kouriIsland.coords,
        locations.chumiOquarium.coords,
        locations.americanVillage.coords
    ];
    L.polyline(tourRoute, {
        color: dayColors[2],
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);

    // 第二段：自由行路線（美國村 → 永旺 → 飯店）
    const freeRoute = [
        locations.americanVillage.coords,
        locations.aeonRycom.coords,
        locations.hotelLantama.coords
    ];
    L.polyline(freeRoute, {
        color: '#F39C12',  // 橘色代表自由行
        weight: 4,
        opacity: 0.8
    }).addTo(map);

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

        const googleMapsUrl = getGoogleMapsUrl(loc.coords, loc.name, loc.nameJa);
        marker.bindPopup(`
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; margin-top: 8px; padding: 6px 12px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    📍 在 Google Maps 中打開
                </a>
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

        const googleMapsUrl = getGoogleMapsUrl(loc.coords, loc.name, loc.nameJa);
        marker.bindPopup(`
            <div style="font-family: 'Patrick Hand', cursive;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #2C3E50;">
                    ${loc.icon} ${loc.name}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #4A5568;">
                    ${loc.description}
                </p>
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; margin-top: 8px; padding: 6px 12px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    📍 在 Google Maps 中打開
                </a>
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
        // 初始化 Day 2 地圖（不再需要選項切換）
        initDay2Map();
    }
    if (document.getElementById('day3Map')) {
        initDay3Map();
    }
    if (document.getElementById('day4Map')) {
        initDay4Map();
    }
});
