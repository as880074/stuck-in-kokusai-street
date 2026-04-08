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

    // 試算器監聽
    const inputTWD = document.getElementById('inputTWD');
    const inputJPY = document.getElementById('inputJPY');

    inputTWD.addEventListener('input', () => {
        const rate = parseFloat(document.getElementById('averageRateDisplay').innerText);
        if (rate && inputTWD.value) {
            inputJPY.value = (parseFloat(inputTWD.value) * rate).toFixed(0);
        } else {
            inputJPY.value = '';
        }
    });

    inputJPY.addEventListener('input', () => {
        const rate = parseFloat(document.getElementById('averageRateDisplay').innerText);
        if (rate && inputJPY.value) {
            inputTWD.value = (parseFloat(inputJPY.value) / rate).toFixed(2);
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
            const totalTWD = jpy / rate;
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
 * 抓取歷史匯率並計算平均值
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

    showLoading('正在抓取匯率數據...');

    try {
        // 使用 Frankfurter API 抓取區間
        const url = `${CONFIG.HISTORICAL_CURRENCY_API_URL}/${start}..${end}?from=TWD&to=JPY`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('API 請求失敗');
        
        const data = await response.json();
        const rates = data.rates;
        
        if (!rates || Object.keys(rates).length === 0) {
            throw new Error('該區間無匯率數據');
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
 * 處理並顯示結果
 */
function processRates(rates, start, end) {
    const historyTableBody = document.getElementById('historyTableBody');
    const calcProcess = document.getElementById('calcProcess');
    const averageRateDisplay = document.getElementById('averageRateDisplay');
    const averageInfoText = document.getElementById('averageInfoText');

    historyTableBody.innerHTML = '';
    
    let sum = 0;
    let count = 0;
    let processText = '計算公式：\n';

    // 取得所有日期並排序
    const sortedDates = Object.keys(rates).sort();
    
    sortedDates.forEach(date => {
        const rate = rates[date].JPY;
        sum += rate;
        count++;

        // 填充表格
        const row = `<tr>
            <td>${date}</td>
            <td>${rate.toFixed(4)}</td>
        </tr>`;
        historyTableBody.innerHTML += row;

        processText += `[${date}] 匯率: ${rate.toFixed(4)}\n`;
    });

    const average = sum / count;
    
    // 顯示過程
    processText += `--------------------\n`;
    processText += `總和 (${sum.toFixed(4)}) / 天數 (${count}) = ${average.toFixed(4)}\n`;
    calcProcess.innerText = processText;

    // 顯示最終平均值
    averageRateDisplay.innerText = average.toFixed(4);
    averageInfoText.innerText = `根據 ${start} 至 ${end} 共 ${count} 筆有效數據計算`;
    
    // 清空試算器與分帳
    document.getElementById('inputTWD').value = '';
    document.getElementById('inputJPY').value = '';
    document.getElementById('splitJPY').value = '';
    document.getElementById('splitResult').innerText = 'NT$ 0';
}
