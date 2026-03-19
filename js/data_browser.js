// data_browser.js - Logic for Professional Terminal Data Browser

let myChart = null;
let selectedIndicators = new Map(); // Store metadata: { name: { id, formula, freq, unit, start, end, ... } }

// Define some mock data to plot
const mockTimeline = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03'];
const colorPalette = ['#1A73E8', '#34A853', '#FBBC05', '#EA4335', '#9333EA'];

document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize ECharts instance
    const chartDom = document.getElementById('main-chart');
    myChart = echarts.init(chartDom);

    // 2. Add event listeners to sidebar items
    const treeItems = document.querySelectorAll('.tree-item');
    treeItems.forEach(item => {
        item.addEventListener('click', function () {
            const indicator = this.getAttribute('data-indicator');
            toggleIndicator(indicator, this);
        });
    });

    // 3. Check for URL parameters to auto-select an indicator
    const urlParams = new URLSearchParams(window.location.search);
    const initialIndicator = urlParams.get('indicator');
    if (initialIndicator) {
        // Find in tree and simulate click
        const targetNode = Array.from(treeItems).find(el => el.getAttribute('data-indicator').includes(initialIndicator));
        if (targetNode) {
            const category = targetNode.closest('.tree-category');
            if (category && !category.classList.contains('active')) {
                toggleTree(category.querySelector('.tree-category-header'));
            }
            toggleIndicator(targetNode.getAttribute('data-indicator'), targetNode);
        } else {
            // Fallback add if not in tree
            toggleIndicator(initialIndicator, null);
        }
    }

    // Initialize horizontal resizer for top/bottom split
    initResizer();

    // Resize handler
    window.addEventListener('resize', () => {
        if (myChart) myChart.resize();
    });
});

// Sidebar Tree toggle
function toggleTree(headerEl) {
    const parent = headerEl.parentElement;
    const items = parent.querySelector('.tree-items');
    const icon = headerEl.querySelector('i');

    if (parent.classList.contains('active')) {
        parent.classList.remove('active');
        items.style.display = 'none';
        icon.className = 'fa-solid fa-caret-right';
    } else {
        parent.classList.add('active');
        items.style.display = 'block';
        icon.className = 'fa-solid fa-caret-down';
    }
}

// Resizer logic
function initResizer() {
    let isResizing = false;
    const resizer = document.getElementById('vertical-resizer');
    const topPanel = document.querySelector('.term-upper-pane');

    resizer.addEventListener('mousedown', function (e) {
        isResizing = true;
        document.body.style.cursor = 'row-resize';
    });

    document.addEventListener('mousemove', function (e) {
        if (!isResizing) return;

        let newHeight = e.clientY - topPanel.getBoundingClientRect().top;
        if (newHeight > 60 && newHeight < window.innerHeight - 300) {
            topPanel.style.height = newHeight + 'px';
            if (myChart) myChart.resize();
        }
    });

    document.addEventListener('mouseup', function (e) {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
        }
    });
}


// Handle clicking on an indicator
function toggleIndicator(indicatorName, htmlEl) {
    if (selectedIndicators.has(indicatorName)) {
        selectedIndicators.delete(indicatorName);
        if (htmlEl) htmlEl.classList.remove('active');
    } else {
        // Generate mock metadata based on the screenshot
        let mockId = "00" + Math.floor(Math.random() * 1000000);
        let freq = indicatorName.includes('率') ? '日' : '月';
        let unit = indicatorName.includes('率') ? '%' : '辆';
        let source = indicatorName.includes('美国') ? '美国财政部' : '上市公司公告';
        let start = indicatorName.includes('美国') ? '1953-04-30' : '2009-01';
        let country = indicatorName.includes('美国') ? '美国' : '中国';

        selectedIndicators.set(indicatorName, {
            id: mockId,
            formula: '',
            freq: freq,
            unit: unit,
            start: start,
            end: '2026-03',
            updated: '2026-03-05',
            source: source,
            country: country
        });
        if (htmlEl) htmlEl.classList.add('active');
    }

    updateWorkspace();
}

function removeIndicator(indicatorName) {
    selectedIndicators.delete(indicatorName);
    // Remove active class from tree
    const treeItems = document.querySelectorAll('.tree-item');
    treeItems.forEach(item => {
        if (item.getAttribute('data-indicator') === indicatorName) {
            item.classList.remove('active');
        }
    });

    updateWorkspace();
}

// Update UI
function updateWorkspace() {
    document.getElementById('ind-count-disp').innerText = selectedIndicators.size;
    renderMetaTable();
    drawChart();
    renderValueTable();
}

function renderMetaTable() {
    const tbody = document.querySelector('#metadata-table tbody');
    tbody.innerHTML = '';

    Array.from(selectedIndicators.entries()).forEach(([name, meta]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: center;"><input type="checkbox" checked></td>
            <td>${name}</td>
            <td>${meta.id}</td>
            <td>${meta.formula}</td>
            <td>${meta.freq}</td>
            <td>${meta.unit}</td>
            <td>${meta.start}</td>
            <td>${meta.end}</td>
            <td>${meta.updated}</td>
            <td>${meta.source}</td>
            <td>${meta.country}</td>
        `;
        tbody.appendChild(tr);
    });
}

function drawChart() {
    if (selectedIndicators.size === 0) {
        myChart.clear();
        return;
    }

    let seriesData = [];
    let legends = [];
    let colorIdx = 0;

    Array.from(selectedIndicators.keys()).forEach(ind => {
        legends.push(ind);

        // Generate mock data deterministic to the string
        let baseVal = ind.length * 2 + Math.random();
        let scale = ind.includes('率') ? 1 : 1000;
        let data = mockTimeline.map((_, i) => parseFloat((baseVal + Math.sin(i) * 0.5 + i * 0.1).toFixed(2)) * scale);

        seriesData.push({
            name: ind,
            type: 'line',
            showSymbol: false,
            itemStyle: { color: colorPalette[colorIdx % colorPalette.length] },
            lineStyle: { width: 1.5 },
            data: data
        });

        colorIdx++;
    });

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: legends, bottom: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 4, textStyle: { fontSize: 11 } },
        grid: { left: '40px', right: '40px', bottom: '15%', top: '20px', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: mockTimeline, axisLine: { lineStyle: { color: '#EAECEF' } }, axisLabel: { fontSize: 10 } },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#F0F2F5' } }, axisLabel: { fontSize: 10 } },
        series: seriesData
    };

    myChart.setOption(option, true);
}

function renderValueTable() {
    const table = document.getElementById('data-value-table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Header
    thead.innerHTML = '<th style="width: 40px; text-align: center;">序号</th><th>日期</th>';
    Array.from(selectedIndicators.keys()).forEach(ind => {
        const meta = selectedIndicators.get(ind);
        thead.innerHTML += `<th>${ind}<br><span style="font-weight:normal; font-size:10px; color:#888;">${meta.freq} | ${meta.unit}</span></th>`;
    });

    // Body
    tbody.innerHTML = '';
    if (selectedIndicators.size === 0) return;

    let indicatorsArray = Array.from(selectedIndicators.keys());

    // reverse time order (newest first)
    let rowIndex = 1;
    for (let i = mockTimeline.length - 1; i >= 0; i--) {
        let trHtml = `<td style="text-align: center; color:#999;">${rowIndex++}</td><td style="text-align: center;">${mockTimeline[i]}</td>`;

        indicatorsArray.forEach(ind => {
            let baseVal = ind.length * 2;
            let scale = ind.includes('率') ? 1 : 1000;
            let val = parseFloat((baseVal + Math.sin(i) * 0.5 + i * 0.1).toFixed(2)) * scale;
            trHtml += `<td>${val.toLocaleString()}</td>`;
        });

        const tr = document.createElement('tr');
        tr.innerHTML = trHtml;
        tbody.appendChild(tr);
    }
}


// ----- AI Chat (RIS) Logic ----- //
function toggleAIChat() {
    const sidebar = document.getElementById('ai-chat-sidebar');
    const icon = document.getElementById('collapse-icon');

    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        icon.className = 'fa-solid fa-angles-right';
    } else {
        sidebar.classList.add('collapsed');
        icon.className = 'fa-solid fa-angles-left';
    }

    // Slight delay to allow transition before resizing chart
    setTimeout(() => {
        if (myChart) myChart.resize();
    }, 300);
}

function handleAIChatPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAIChat();
    }
}

function sendAIChat() {
    const input = document.getElementById('ai-prompt-input');
    const query = input.value.trim();
    if (!query) return;

    appendChatMessage(query, 'user');
    input.value = "";

    // Simulate thinking
    setTimeout(() => {
        let responseMsg = "";

        if (query.includes('美国') || query.includes('收益率')) {
            // Trigger UI changes
            if (!selectedIndicators.has('美国:国债收益率:2年')) toggleIndicator('美国:国债收益率:2年');
            if (!selectedIndicators.has('美国:国债收益率:10年')) toggleIndicator('美国:国债收益率:10年');
            if (!selectedIndicators.has('美国:国债收益率利差:10年-2年')) toggleIndicator('美国:国债收益率利差:10年-2年');

            responseMsg = `✅ 已为您提取 **美国国债收益率（2年期、10年期）及期限利差** 数据，并绘制叠加折线图。\n长短端利差持续倒挂通常被视为经济衰退的前瞻指标，您可以结合左侧的图表趋势进行研判。`;
        } else {
            // Fallback
            responseMsg = `✅ 明白。我已经根据您的要求提取了相关指标数据并放入工作区。您可以随时在上方工具栏调整图表样式或导出数据。`;
            if (!selectedIndicators.has('广义累库量')) toggleIndicator('广义累库量');
        }

        appendChatMessage(responseMsg, 'ai');

    }, 1000);
}

function appendChatMessage(text, sender) {
    const chatBox = document.getElementById('ai-chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg-bubble ${sender}`;

    let html = '';
    if (sender === 'ai') {
        html = `
            <div class="msg-avatar"><img src="https://ui-avatars.com/api/?name=RIS&background=4B85E6&color=fff" alt="RIS"></div>
            <div class="msg-content"><p>${text.replace(/\n/g, '<br>')}</p></div>
        `;
    } else {
        html = `
            <div class="msg-content"><p>${text.replace(/\n/g, '<br>')}</p></div>
        `;
    }

    msgDiv.innerHTML = html;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
