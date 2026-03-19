document.addEventListener('DOMContentLoaded', () => {
    // 1. Accordion Menu Logic
    const menuItems = document.querySelectorAll('.accordion-menu .menu-title');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const submenu = item.nextElementSibling;
            const arrow = item.querySelector('.arrow');

            if (submenu && submenu.classList.contains('submenu')) {
                const isVisible = submenu.style.display === 'block';
                submenu.style.display = isVisible ? 'none' : 'block';

                if (arrow) {
                    if (isVisible) {
                        arrow.classList.remove('fa-chevron-down');
                        arrow.classList.add('fa-chevron-right');
                    } else {
                        arrow.classList.remove('fa-chevron-right');
                        arrow.classList.add('fa-chevron-down');
                    }
                }
            }
        });
    });

    // 2. Financial Table Toggle Logic
    const toggleIcons = document.querySelectorAll('.fin-table .toggle-icon');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const isMinus = this.classList.contains('fa-square-minus');
            let nextRow = this.closest('tr').nextElementSibling;

            if (isMinus) {
                this.classList.replace('fa-square-minus', 'fa-square-plus');
                while (nextRow && !nextRow.classList.contains('group-row')) {
                    nextRow.classList.add('hidden');
                    nextRow = nextRow.nextElementSibling;
                }
            } else {
                this.classList.replace('fa-square-plus', 'fa-square-minus');
                while (nextRow && !nextRow.classList.contains('group-row')) {
                    nextRow.classList.remove('hidden');
                    nextRow = nextRow.nextElementSibling;
                }
            }
        });
    });

    // 3. ECharts Initialization
    initImpactStockChart();
    initRelationMapChart();
    renderMapList(); // populate the right sidebar list

    // Initialize Business Analysis Charts
    initBARevenuePieChart();
    initBAPEScatterChart();
    initBAPSScatterChart();
    initBATabsScrollLogic();

    // 4. Sidebar View Switching
    const btnComprehensive = document.getElementById('menu-comprehensive');
    const btnMap = document.getElementById('menu-map');
    const btnBusinessAnalysis = document.getElementById('menu-business-analysis');

    const viewComprehensive = document.getElementById('view-comprehensive');
    const viewMap = document.getElementById('view-map');
    const viewBusinessAnalysis = document.getElementById('view-business-analysis');

    function switchView(activeBtn, activeView) {
        [btnComprehensive, btnMap, btnBusinessAnalysis].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        [viewComprehensive, viewMap, viewBusinessAnalysis].forEach(view => {
            if (view) view.style.display = 'none';
        });

        if (activeBtn) activeBtn.classList.add('active');
        if (activeView) activeView.style.display = 'block';

        // Re-render chart since container might have been hidden
        setTimeout(() => {
            window.echartsInstances.forEach(chart => {
                if (chart) chart.resize();
            });
        }, 100);
    }

    if (btnComprehensive) btnComprehensive.addEventListener('click', () => switchView(btnComprehensive, viewComprehensive));
    if (btnMap) btnMap.addEventListener('click', () => switchView(btnMap, viewMap));
    if (btnBusinessAnalysis) btnBusinessAnalysis.addEventListener('click', () => switchView(btnBusinessAnalysis, viewBusinessAnalysis));

    // Resize charts on window resize
    window.addEventListener('resize', () => {
        window.echartsInstances.forEach(chart => {
            if (chart) chart.resize();
        });
    });
});

// Store echarts instances for resizing
window.echartsInstances = [];

function initImpactStockChart() {
    const dom = document.getElementById('impact-stock-chart');
    if (!dom) return;
    const chart = echarts.init(dom);
    window.echartsInstances.push(chart);

    const dates = [];
    const prices = [];
    const volumes = [];
    let basePrice = 35;

    for (let i = 0; i < 90; i++) {
        dates.push(`2025-${(Math.floor(i / 30) + 3).toString().padStart(2, '0')}-${((i % 30) + 1).toString().padStart(2, '0')}`);

        const filterInput = document.getElementById('impact-news-filter');
        let shift = (Math.random() - 0.45) * 2;
        if (filterInput && filterInput.value === '业绩相关') {
            shift = (Math.random() - 0.2) * 4; // More volatile
        }

        basePrice = basePrice + shift;
        prices.push(basePrice.toFixed(2));
        volumes.push(Math.floor(Math.random() * 50000 + 10000));
    }

    const option = {
        grid: { top: 20, right: 30, bottom: 40, left: 30 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: { color: '#999', fontSize: 10 },
            axisLine: { lineStyle: { color: '#EAECEF' } },
            axisTick: { show: false }
        },
        yAxis: [
            {
                type: 'value',
                scale: true,
                position: 'right',
                splitLine: { lineStyle: { type: 'dashed', color: '#EAECEF' } },
                axisLabel: { color: '#666', fontSize: 10 }
            },
            {
                type: 'value',
                scale: true,
                position: 'left',
                splitLine: { show: false },
                axisLabel: { show: false }
            }
        ],
        series: [
            {
                name: '成交量',
                type: 'bar',
                yAxisIndex: 1,
                data: volumes,
                itemStyle: {
                    color: function (params) {
                        return params.dataIndex % 2 === 0 ? '#EF5350' : '#26A69A';
                    }
                },
                barWidth: '60%'
            },
            {
                name: '价格',
                type: 'line',
                data: prices,
                symbol: 'none',
                lineStyle: { color: '#4B85E6', width: 2 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(75,133,230,0.3)' },
                        { offset: 1, color: 'rgba(75,133,230,0.01)' }
                    ])
                }
            }
        ]
    };
    chart.setOption(option);
}

function initRelationMapChart() {
    const dom = document.getElementById('relation-sunburst-chart');
    if (!dom) return;
    const chart = echarts.init(dom);
    window.echartsInstances.push(chart);

    // Categories and their angles
    const categories = [
        { name: '对外投资', color: '#4B85E6', bg: 'rgba(75,133,230,0.05)' },
        { name: '同赛道公司', color: '#4B85E6', bg: 'rgba(75,133,230,0.1)' },
        { name: '股权投资方', color: '#E6A23C', bg: 'rgba(230,162,60,0.05)' },
        { name: '客户及合作企业', color: '#E63D3D', bg: 'rgba(230,61,61,0.05)' },
        { name: '上游供应商', color: '#31CFC2', bg: 'rgba(49,207,194,0.05)' }
    ];

    const pieData = categories.map(c => ({
        value: 1,
        name: c.name,
        itemStyle: { color: c.bg, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, position: 'inner', color: c.color, fontSize: 16, fontWeight: 'bold' }
    }));

    // Generate scatter nodes for outer rings
    const scatterData = [];
    const ringRadii = [65, 80, 95]; // Virtual coordinates 0-100
    let nodeCount = 0;

    categories.forEach((cat, catIndex) => {
        // base angle for this sector
        const baseAngle = (Math.PI * 2 / 5) * catIndex + (Math.PI / 5);

        // Add random nodes in this sector
        const numNodes = 6 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numNodes; i++) {
            const angleOffset = (Math.random() - 0.5) * (Math.PI / 3);
            const angle = baseAngle + angleOffset;
            const radius = ringRadii[Math.floor(Math.random() * ringRadii.length)] + (Math.random() * 5);

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            scatterData.push({
                name: `公司节点 ${++nodeCount}`,
                value: [x, y],
                itemStyle: { color: 'white', borderColor: cat.color, borderWidth: 1 },
                label: {
                    show: true,
                    formatter: `{dot|}{name|节点 ${nodeCount}}`,
                    rich: {
                        dot: { backgroundColor: cat.color, width: 6, height: 6, borderRadius: 3, margin: [0, 4, 0, 0] },
                        name: { color: '#666', fontSize: 11 }
                    },
                    position: 'right',
                    distance: 5,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    padding: [4, 8],
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#EAECEF',
                    shadowColor: 'rgba(0,0,0,0.05)',
                    shadowBlur: 4,
                    shadowOffsetY: 2
                },
                symbolSize: 8
            });
        }
    });

    // Outer auxiliary dashed rings and texts
    const auxiliaryScatter = [];
    ['联网查询', '专业数据库', '公告及知识库', '专业数据库', '联网查询'].forEach((text, i) => {
        const a = (Math.PI * 2 / 5) * i;
        auxiliaryScatter.push({
            value: [Math.cos(a) * 55, Math.sin(a) * 55],
            label: { show: true, formatter: text, color: '#4B85E6', fontSize: 12, position: 'center' },
            itemStyle: { color: 'transparent' }
        });
    });

    const option = {
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        xAxis: { show: false, min: -110, max: 110 },
        yAxis: { show: false, min: -110, max: 110 },
        series: [
            // Middle sectors
            {
                type: 'pie',
                radius: ['25%', '50%'],
                center: ['50%', '50%'],
                startAngle: 90,
                data: pieData,
                labelLine: { show: false },
                silent: false, // Make clickable
                z: 1
            },
            // Center focal node
            {
                type: 'pie',
                radius: ['0%', '24%'],
                center: ['50%', '50%'],
                itemStyle: { color: '#fff', shadowColor: 'rgba(75,133,230,0.2)', shadowBlur: 20 },
                label: { show: true, position: 'center', formatter: '速腾聚创', color: '#4B85E6', fontSize: 20, fontWeight: 'bold' },
                data: [{ value: 1 }],
                silent: true,
                z: 2
            },
            // Auxiliary dashed circles
            {
                type: 'pie',
                radius: ['55%', '55%'],
                center: ['50%', '50%'],
                itemStyle: { color: 'transparent', borderColor: '#4B85E6', borderWidth: 1, borderType: 'dashed', opacity: 0.3 },
                data: [{ value: 1 }],
                label: { show: false },
                silent: true,
                z: 0
            },
            {
                type: 'pie',
                radius: ['75%', '75%'],
                center: ['50%', '50%'],
                itemStyle: { color: 'transparent', borderColor: '#EAECEF', borderWidth: 1, borderType: 'solid', opacity: 0.5 },
                data: [{ value: 1 }],
                label: { show: false },
                silent: true,
                z: 0
            },
            {
                type: 'pie',
                radius: ['95%', '95%'],
                center: ['50%', '50%'],
                itemStyle: { color: 'transparent', borderColor: '#EAECEF', borderWidth: 1, borderType: 'solid', opacity: 0.5 },
                data: [{ value: 1 }],
                label: { show: false },
                silent: true,
                z: 0
            },
            // Auxiliary Text rings
            {
                type: 'scatter',
                data: auxiliaryScatter,
                symbolSize: 1,
                silent: true,
                z: 3
            },
            // Nodes scatter
            {
                type: 'scatter',
                data: scatterData,
                z: 4
            }
        ]
    };
    chart.setOption(option);
}

function renderMapList() {
    const tbody = document.getElementById('map-list-tbody');
    if (!tbody) return;

    const mockData = [
        { name: '深圳市速腾聚创科技有限公司', type: '对外投资', typeColor: '#4B85E6', bg: 'rgba(75,133,230,0.1)', source: '公告及知识库' },
        { name: '深圳市速腾精工(深圳)有限公司', type: '对外投资', typeColor: '#4B85E6', bg: 'rgba(75,133,230,0.1)', source: '公告及知识库' },
        { name: '深圳智驾科技有限公司', type: '对外投资', typeColor: '#4B85E6', bg: 'rgba(75,133,230,0.1)', source: '公告及知识库' },
        { name: '保时捷企', type: '对外投资', typeColor: '#4B85E6', bg: 'rgba(75,133,230,0.1)', source: '专业数据库' },
        { name: '曼哈顿投行', type: '对外投资', typeColor: '#4B85E6', bg: 'rgba(75,133,230,0.1)', source: '专业数据库' },
        { name: '立腾创新', type: '对外投资', typeColor: '#4B85E6', bg: 'rgba(75,133,230,0.1)', source: '专业数据库' },
        { name: '华清电子器材部电子有限公司', type: '对外投资', typeColor: '#4B85E6', bg: 'rgba(75,133,230,0.1)', source: '联网查询' },
        { name: '光电股份(000632.SZ)', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: '运达电子(原合肥聚星光电)', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: 'Intel', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: 'Texas Instruments', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: '纵翼芯片', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: '长光华芯', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: 'Lattice Semiconductor', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: 'NXTronics', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '联网查询' },
        { name: 'Marvell Semiconductor', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: '博冠科技', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: '岭南科技(微明全资子公司)', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '公告及知识库' },
        { name: '永晶光电(002273)', type: '上游供应商', typeColor: '#31CFC2', bg: 'rgba(49,207,194,0.1)', source: '联网查询' }
    ];

    let html = '';
    mockData.forEach((item, index) => {
        const bg = index % 2 === 0 ? 'transparent' : '#FAFAFB';
        html += `
            <tr style="background:${bg}; border-bottom:1px solid #EAECEF;">
                <td style="padding:10px 12px; border:none; display:flex; align-items:center; gap:8px;">
                    <span style="font-weight:500; color:#333;">${item.name}</span>
                    <span style="font-size:10px; color:${item.typeColor}; background:${item.bg}; padding:2px 6px; border-radius:4px; white-space:nowrap;">${item.type}</span>
                </td>
                <td style="padding:10px 12px; border:none; color:#666;">${item.source}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Global Filter Logic (Interactive Mocking)
function bindGlobalFilters() {
    // Make filter pills toggleable
    const filterPillGroups = document.querySelectorAll('.ba-table-filters, .ba-card');

    filterPillGroups.forEach(group => {
        const pills = group.querySelectorAll('.filter-pill');
        if (pills.length === 0) return;

        pills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                // If this pill belongs to a group of sibling pills, toggle active class
                const siblings = pill.parentElement.querySelectorAll('.filter-pill');
                if (siblings.length > 1) {
                    siblings.forEach(s => s.classList.remove('active'));
                    pill.classList.add('active');

                    // Trigger mock data update based on what was clicked
                    updateMockDataOnFilterChange(pill.innerText);
                }
            });
        });
    });

    // Make select boxes trigger updates
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            updateMockDataOnFilterChange(select.value);
        });
    });

    // Sub-view chart recalculations
    const calcBtn = document.querySelector('button:contains("开始计算")');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            updateMockDataOnFilterChange('calculate');
        });
    }

    // Impact news input "enter"
    const newsInput = document.getElementById('impact-news-filter');
    if (newsInput) {
        newsInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                updateMockDataOnFilterChange('news');
            }
        });
    }
}

// Pseudo-selector polyfill logic since `:contains` is jQuery
HTMLElement.prototype.getNodesByText = function (text) {
    return Array.from(this.querySelectorAll('*')).filter(el => el.textContent.trim() === text);
}

// Helper to randomly perturb tables and charts
function updateMockDataOnFilterChange(triggerContext) {
    // 1. Randomize standard table cells that contain numbers
    const allTableCells = document.querySelectorAll('.fin-table tbody td');
    allTableCells.forEach(cell => {
        const txt = cell.innerText.trim();
        // Skip texts, dates, and non-numbers
        if (!isNaN(parseFloat(txt)) && txt !== '') {
            let num = parseFloat(txt);
            // Random change by +/- 15%
            let shift = num * (Math.random() * 0.3 - 0.15);
            let newVal = num + shift;

            // Format back
            if (txt.includes('%')) {
                cell.innerText = newVal.toFixed(2) + '%';
            } else if (txt.includes('.')) {
                cell.innerText = newVal.toFixed(2);
            } else {
                cell.innerText = Math.round(newVal);
            }
        }
    });

    // 2. Randomize flowchart numbers
    document.querySelectorAll('.param-nodes > div').forEach(node => {
        const valEls = node.querySelectorAll('.font-weight-bold, div[style*="font-size:16px"]');
        valEls.forEach(el => {
            const txt = el.innerText.trim();
            if (txt.includes('%')) {
                let num = parseFloat(txt);
                el.innerText = (num + (Math.random() * 4 - 2)).toFixed(2) + '%';
            }
        });
    });

    // 3. Update charts
    if (window.echartsInstances && window.echartsInstances.length > 0) {
        window.echartsInstances.forEach((chart, index) => {
            if (!chart) return;
            const currentOption = chart.getOption();
            if (!currentOption || !currentOption.series) return;

            currentOption.series.forEach(seriesParam => {
                if (seriesParam.type === 'scatter') {
                    // Jitter scatter points
                    seriesParam.data.forEach(pt => {
                        if (pt.value && pt.value.length >= 2) {
                            pt.value[0] = pt.value[0] * (1 + (Math.random() * 0.2 - 0.1));
                            pt.value[1] = pt.value[1] * (1 + (Math.random() * 0.2 - 0.1));
                        }
                    });
                } else if (seriesParam.type === 'pie' && seriesParam.name === '营收构成') {
                    // Shuffle pie data
                    seriesParam.data.forEach(pt => {
                        let num = parseFloat(pt.value);
                        pt.value = (num * (1 + (Math.random() * 0.3 - 0.15))).toFixed(2);
                    });
                } else if (seriesParam.type === 'candlestick') {
                    // Very slight perturbation of candlesticks usually isn't desired for interactivity mock
                    // We will just re-init to simulate a new fetch
                    // initImpactStockChart relies on DOM and global variables, avoid direct recursion here
                }
            });
            chart.setOption(currentOption);
        });

        // Re-run the main impact chart specifically to show dramatic changes based on news
        if (triggerContext === 'news' || triggerContext === '1W' || triggerContext === '1M' || triggerContext === '1Y') {
            initImpactStockChart();
        }
    }
}


// ==========================================
// Business Analysis Charts & Logic
// ==========================================
function initBATabsScrollLogic() {
    const tabs = document.querySelectorAll('.ba-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                // Active state is handled by scroll spy later, but optionally set it here immediately
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            }
        });
    });

    // Simple scroll spy (if the container is the window)
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('.ba-section-scroll-target');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 120) {
                current = section.getAttribute('id');
            }
        });

        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-target') === current) {
                tab.classList.add('active');
            }
        });
    });
}

function initBARevenuePieChart() {
    const dom = document.getElementById('ba-revenue-pie');
    if (!dom) return;
    const chart = echarts.init(dom);
    window.echartsInstances.push(chart);

    const option = {
        tooltip: { trigger: 'item' },
        series: [
            {
                name: '营收构成',
                type: 'pie',
                radius: ['55%', '85%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 2,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}: {d}%',
                    position: 'outer',
                    alignTo: 'labelLine',
                    color: '#666',
                    fontSize: 10
                },
                labelLine: { show: true, length: 10, length2: 10 },
                data: [
                    { value: 65.4, name: '用于ADAS...', itemStyle: { color: '#0078D7' } },
                    { value: 31.88, name: '用于机器人...', itemStyle: { color: '#00A4EF' } },
                    { value: 1.67, name: '服务及其他', itemStyle: { color: '#7FBA00' } },
                    { value: 1.05, name: '解决方案', itemStyle: { color: '#FFB900' } }
                ]
            }
        ]
    };
    chart.setOption(option);
}

function initBAPEScatterChart() {
    const dom = document.getElementById('ba-pe-scatter');
    if (!dom) return;
    const chart = echarts.init(dom);
    window.echartsInstances.push(chart);

    const option = {
        grid: { top: 10, right: 20, bottom: 20, left: 30 },
        xAxis: { type: 'value', show: true, splitLine: { show: false }, axisLine: { lineStyle: { color: '#EAECEF' } }, axisLabel: { color: '#999', fontSize: 10 } },
        yAxis: { type: 'value', show: true, splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } }, axisLabel: { color: '#999', fontSize: 10 } },
        tooltip: { trigger: 'item', formatter: '{b}<br/>PE: {c}' },
        series: [
            {
                type: 'scatter',
                symbolSize: 12,
                itemStyle: { color: '#4B85E6', opacity: 0.8 },
                data: [
                    { name: '寒武纪', value: [10, 85] },
                    { name: '德赛西威', value: [20, 73.74] },
                    { name: '四维图新', value: [30, 45] },
                    { name: '速腾聚创', value: [40, 55], itemStyle: { color: '#FF6B6B' } }
                ]
            }
        ]
    };
    chart.setOption(option);
}

function initBAPSScatterChart() {
    const dom = document.getElementById('ba-ps-scatter');
    if (!dom) return;
    const chart = echarts.init(dom);
    window.echartsInstances.push(chart);

    const option = {
        grid: { top: 10, right: 20, bottom: 20, left: 30 },
        xAxis: { type: 'value', show: true, splitLine: { show: false }, axisLine: { lineStyle: { color: '#EAECEF' } }, axisLabel: { color: '#999', fontSize: 10 } },
        yAxis: { type: 'value', show: true, splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } }, axisLabel: { color: '#999', fontSize: 10 } },
        tooltip: { trigger: 'item', formatter: '{b}<br/>PS: {c}' },
        series: [
            {
                type: 'scatter',
                symbolSize: 12,
                itemStyle: { color: '#31CFC2', opacity: 0.8 },
                data: [
                    { name: '平治信息', value: [15, 12] },
                    { name: '德赛西威', value: [25, 31.57] },
                    { name: '中控技术', value: [35, 18] },
                    { name: '速腾聚创', value: [45, 25], itemStyle: { color: '#FF6B6B' } }
                ]
            }
        ]
    };
    chart.setOption(option);
}

// Ensure filters bind at the script's end
document.addEventListener('DOMContentLoaded', () => {
    // Other setups...
    setTimeout(bindGlobalFilters, 500);
});
