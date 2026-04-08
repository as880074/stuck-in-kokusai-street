/**
 * Currency-Calc.js - 匯率平均值計算功能
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化日期為行程日期 (從 config.js 取得)
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (CONFIG.TRIP_DATES) {
        startDateInput.value = CONFIG.TRIP_DATES.START;
        endDateInput.value = CONFIG.TRIP_DATES.END;
    }

    const btnFetch = document.getElementById('btnFetch');
    btnFetch.addEventListener('click', fetchAndCalculate);

    // 試算器監聽 (rate = 1 JPY = X TWD)
    const inputTWD = document.getElementById('inputTWD');
    const inputJPY = document.getElementById('inputJPY');

    // 輸入日幣 → 自動計算台幣
    inputJPY.addEventListener('input', () => {
        const rate = parseFloat(document.getElementById('averageRateDisplay').innerText);
        if (rate && inputJPY.value) {
            inputTWD.value = (parseFloat(inputJPY.value) * rate).toFixed(2);
        } else {
            inputTWD.value = '';
        }
    });

    // 好友分帳監聽
    const splitJPY = document.getElementById('splitJPY');
    const peopleCount = document.getElementById('peopleCount');
    const splitResult = document.getElementById('splitResult');

    const updateSplit = () => {
        const rate = parseFloat(document.getElementById('averageRateDisplay').innerText);
        const jpy = parseFloat(splitJPY.value);
        const people = parseInt(peopleCount.value);

        if (rate && jpy && people > 0) {
            const totalTWD = jpy * rate; // JPY × rate = TWD
            const perPerson = Math.ceil(totalTWD / people);
            splitResult.innerText = `NT$ ${perPerson.toLocaleString()}`;
        } else {
            splitResult.innerText = 'NT$ 0';
        }
    };

    splitJPY.addEventListener('input', updateSplit);
    peopleCount.addEventListener('input', updateSplit);
});

/**
 * 抓取歷史匯率並計算平均值（使用 fawazahmed0 currency-api）
 */
async function fetchAndCalculate() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start || !end) {
        showToast('請選擇完整的日期區間', 'warning');
        return;
    }

    if (new Date(start) > new Date(end)) {
        showToast('開始日期不能晚於結束日期', 'error');
        return;
    }

    showLoading('正在抓取歷史匯率數據...');

    try {
        const rates = await fetchHistoricalRates(start, end);
        
        if (Object.keys(rates).length === 0) {
            throw new Error('無法取得該區間的匯率數據');
        }

        processRates(rates, start, end);
        document.getElementById('resultsSection').style.display = 'block';
        scrollToElement('#resultsSection');
        
    } catch (error) {
        console.error('Fetch error:', error);
        showToast(`錯誤: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

/**
 * 抓取指定日期區間的歷史匯率
 */
async function fetchHistoricalRates(start, end) {
    const rates = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 收集所有日期
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }
    
    // 並行抓取所有日期的匯率（最多同時 5 個請求）
    const batchSize = 5;
    for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(date => fetchRateForDate(date, today))
        );
        
        results.forEach(result => {
            if (result) {
                rates[result.date] = { JPY: result.rate };
            }
        });
    }
    
    return rates;
}

/**
 * 抓取單一日期的匯率
 */
async function fetchRateForDate(date, today) {
    const dateStr = date.toISOString().split('T')[0];
    
    // 判斷是否為未來日期
    const isFuture = date > today;
    
    // 構建 API URL
    // 未來日期使用 latest，過去日期使用指定日期
    const dateParam = isFuture ? 'latest' : `@${dateStr}`;
    const urls = [
        `${CONFIG.CURRENCY_API_BASE}${dateParam}/v1/currencies/jpy.json`,
        `${CONFIG.CURRENCY_API_FALLBACK}/v1/currencies/jpy.json` // 備用只有 latest
    ];
    
    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.jpy && data.jpy.twd) {
                    // API 返回 1 JPY = X TWD
                    const rate = data.jpy.twd;
                    return { date: dateStr, rate };
                }
            }
        } catch (e) {
            console.warn(`抓取 ${dateStr} 失敗:`, e.message);
        }
    }
    
    return null;
}

/**
 * 處理並顯示結果
 */
function processRates(rates, start, end) {
    const historyTableBody = document.getElementById('historyTableBody');
    const calcProcess = document.getElementById('calcProcess');
    const averageRateDisplay = document.getElementById('averageRateDisplay');
    const dailyRatesList = document.getElementById('dailyRatesList');
    const calcFormula = document.getElementById('calcFormula');

    historyTableBody.innerHTML = '';
    
    let sum = 0;
    let count = 0;
    const rateValues = [];

    // 取得所有日期並排序
    const sortedDates = Object.keys(rates).sort();
    
    // 建立每日匯率 HTML
    let dailyHtml = '<strong>📅 每日匯率 (1 JPY = ? TWD)</strong><br><br>';
    
    sortedDates.forEach((date, index) => {
        const rate = rates[date].JPY;
        sum += rate;
        count++;
        rateValues.push(rate.toFixed(4));

        // 填充表格
        const row = `<tr>
            <td>${date}</td>
            <td>${rate.toFixed(4)}</td>
        </tr>`;
        historyTableBody.innerHTML += row;

        dailyHtml += `&nbsp;&nbsp;📆 第 ${index + 1} 天 <span style="color:#666">(${date})</span>: <strong style="color:#e74c3c">${rate.toFixed(4)}</strong> TWD<br>`;
    });
    
    dailyRatesList.innerHTML = dailyHtml;

    const average = sum / count;
    
    // 建立計算公式 HTML
    let formulaHtml = '<strong>🧮 計算公式</strong><br><br>';
    formulaHtml += `<strong>步驟 1：加總所有匯率</strong><br>`;
    formulaHtml += `&nbsp;&nbsp;${rateValues.join(' + ')}<br>`;
    formulaHtml += `&nbsp;&nbsp;= <strong>${sum.toFixed(4)}</strong><br><br>`;
    formulaHtml += `<strong>步驟 2：除以天數</strong><br>`;
    formulaHtml += `&nbsp;&nbsp;${sum.toFixed(4)} ÷ ${count} 天<br>`;
    formulaHtml += `&nbsp;&nbsp;= <strong style="color:#27ae60; font-size:1.1em">${average.toFixed(4)}</strong>`;
    
    calcFormula.innerHTML = formulaHtml;

    // 顯示最終平均值
    averageRateDisplay.innerText = average.toFixed(4);
    const rateText = document.getElementById('rateText');
    if (rateText) rateText.innerText = average.toFixed(4);
    
    // 更新下方詳細計算過程
    let processText = `📊 完整計算記錄\n`;
    processText += `━━━━━━━━━━━━━━━━━━━━\n`;
    processText += `查詢區間: ${start} 至 ${end}\n`;
    processText += `有效天數: ${count} 天\n`;
    processText += `匯率總和: ${sum.toFixed(4)}\n`;
    processText += `平均匯率: ${average.toFixed(4)}\n`;
    processText += `━━━━━━━━━━━━━━━━━━━━`;
    
    if (calcProcess) calcProcess.innerText = processText;
    
    // 清空試算器與分帳
    document.getElementById('inputTWD').value = '';
    document.getElementById('inputJPY').value = '';
    document.getElementById('splitJPY').value = '';
    document.getElementById('splitResult').innerText = 'NT$ 0';
}
