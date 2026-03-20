// hot_tracks.js - Scripts for the Hot Tracks page

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function () {
    initCharts();
    initFeatureTabs();
    initHteForceGraph();
});

// Modal logic removed, pages navigate directly to agent detail.

// ---------- Data Workshop Accordion ---------- //
function toggleAccordion(element) {
    const parent = element.parentElement;
    parent.classList.toggle('active');
}

// ---------- Smart QA Chat Logic ---------- //
function handleQaKeyPress(e) {
    if (e.key === 'Enter') {
        sendQaMessage();
    }
}

function sendQaMessage() {
    const input = document.getElementById('qa-input-field');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user');
    input.value = '';

    // Simulate Agent Thinking
    const chatBox = document.getElementById('qa-chat-box');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg msg-agent';
    loadingDiv.innerHTML = `<div class="typing-indicator" style="display:inline-block; margin-top:2px;"><span></span><span></span><span></span></div>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate Network Request
    setTimeout(() => {
        chatBox.removeChild(loadingDiv);
        let response = "抱歉，我目前无法回答这个问题。";
        if (msg.includes("复合增长率")) {
            response = "根据左侧赛道增长分析折线图，该赛道2023-2025年复合增长率为 <strong>15.2%</strong>。该增速在整个新能源汽车板块中处于前 10% 水平。";
        } else if (msg.includes("龙头企业") || msg.includes("A")) {
            response = "龙头企业A的优势主要体现在完整的垂直整合供应链体系，使其产品毛利率较行业平均水平高出 5 个百分点，同时在下一代感知技术上拥有超 200 项核心专利。";
        } else {
            response = "基于当前的特色分析数据，我们建议您进一步关注其Q3季报警气度反转信号。如果需要更详细的数据，您可以运行左侧的「竞争格局分析 Agent」。";
        }
        appendMessage(response, 'agent');
    }, 1500);
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById('qa-chat-box');
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'msg msg-user' : 'msg msg-agent';
    div.innerHTML = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------- Feature Analysis Tabs ---------- //
function initFeatureTabs() {
    const tabs = document.querySelectorAll('.fa-tab');
    const contents = document.querySelectorAll('.fa-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Lazy-init panels that need first-time setup
            if (targetId === 'fa-tab-sales') {
                setTimeout(initSalesPanels, 60);
            }
            if (targetId === 'fa-tab-inventory') {
                setTimeout(initInvPanels, 60);
            }
            if (targetId === 'fa-tab-compete') {
                setTimeout(initCmpPanels, 60);
            }
            if (targetId === 'fa-tab-chain') {
                setTimeout(initChainCharts, 60);
            }
            // Trigger resize to fix ECharts rendering in hidden divs
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 50);
        });
    });
}

// ---------- ECharts Initialization ---------- //
function initCharts() {
    // Tabs 1, 2, 3 charts have been replaced by custom HTML widgets

    // Tab 4: 产业链 (Currently using custom HTML dashboard, but keep empty functions if needed later)
}

// Handle window resize dynamically to maintain responsiveness
window.addEventListener('resize', () => {
    // Only resize if there are any remaining echarts on the page
});

// ===== AI Assistant Right Drawer =====
function htOpenAssistant() {
    const drawer = document.getElementById('htAiDrawer');
    drawer.classList.remove('collapsed');
    drawer.classList.add('open');
    document.getElementById('htAiHandleIcon').className = 'fa-solid fa-chevron-right';
    setTimeout(() => document.getElementById('htAiInput').focus(), 320);
}

function htCloseAssistant() {
    const drawer = document.getElementById('htAiDrawer');
    drawer.classList.remove('open', 'collapsed');
}

function htToggleCollapse() {
    const drawer = document.getElementById('htAiDrawer');
    const icon = document.getElementById('htAiHandleIcon');
    if (drawer.classList.contains('collapsed')) {
        drawer.classList.remove('collapsed');
        icon.className = 'fa-solid fa-chevron-right';
    } else {
        drawer.classList.add('collapsed');
        icon.className = 'fa-solid fa-chevron-left';
    }
}

function htFillInput(el) {
    const text = el.innerText.trim();
    const input = document.getElementById('htAiInput');
    input.value = text;
    input.focus();
}

function htSendMessage() {
    const input = document.getElementById('htAiInput');
    if (!input.value.trim()) return;
    // Placeholder — wire to real API when ready
    input.value = '';
}

function htToggleTool(el) {
    el.closest('.ht-ai-toolbar').querySelectorAll('.ht-ai-tool').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') htCloseAssistant();
});

// ---------- Data Workshop -> Data Browser Navigation ---------- //
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.data-panel .ht-table tbody tr').forEach(row => {
        const btn = row.querySelector('.btn-link');
        if (btn) {
            const indicatorName = row.cells[0].innerText.trim();
            btn.addEventListener('click', () => {
                window.location.href = `data_browser.html?indicator=${encodeURIComponent(indicatorName)}`;
            });
        }
    });
});



// ===== Demo Engine =====
const _htTimers = [];
function _htAt(t, fn) { _htTimers.push(setTimeout(fn, t)); }
function htClearTimers() { _htTimers.forEach(clearTimeout); _htTimers.length = 0; }

function _htScroll() {
    const b = document.getElementById('htAiDrawerBody');
    if (b) requestAnimationFrame(() => { b.scrollTop = b.scrollHeight; });
}

function _htAppend(html, delay) {
    _htAt(delay, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const tmp = document.createElement('div');
        tmp.innerHTML = html.trim();
        msgs.appendChild(tmp.firstElementChild);
        _htScroll();
    });
}

function _htUserMsg(text, delay) {
    _htAppend(`<div class="ht-msg ht-msg-user">${text}</div>`, delay);
}

function _htShowTyping(delay) {
    _htAt(delay, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.id = 'htTyping'; el.className = 'ht-msg ht-msg-typing';
        el.innerHTML = '<span></span><span></span><span></span>';
        msgs.appendChild(el); _htScroll();
    });
}
function _htHideTyping(delay) {
    _htAt(delay, () => { const el = document.getElementById('htTyping'); if (el) el.remove(); });
}

// ── Think block (image-1 style): intro text + file-path bullets + done text ──
function _htThinkStart(intro, id, delay) {
    _htAt(delay, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-think-msg'; el.id = id;
        el.innerHTML = `<div class="ht-think-intro">${intro}</div><div class="ht-think-tools" id="${id}_t"></div><div class="ht-think-done" id="${id}_d"></div>`;
        msgs.appendChild(el); _htScroll();
    });
}
function _htToolLine(blockId, label, path, ms, delay) {
    _htAt(delay, () => {
        const c = document.getElementById(blockId + '_t');
        if (!c) return;
        const el = document.createElement('div');
        el.className = 'ht-tool-item';
        el.innerHTML = `<span class="ht-tool-bullet">•</span><span class="ht-tool-label">${label}</span><span class="ht-tool-path">${path}</span><span class="ht-tool-ms">${ms}ms</span><span class="ht-tool-dot2">•</span>`;
        c.appendChild(el); _htScroll();
    });
}
function _htThinkDone(blockId, html, delay) {
    _htAt(delay, () => {
        const d = document.getElementById(blockId + '_d');
        if (d) d.innerHTML = html;
        _htScroll();
    });
}

// ── Report document (image-2 style) ──
function _htDocReport(html, delay) {
    _htAppend(`<div class="ht-rdoc">${html}</div>`, delay);
}

// ── Modification summary block (image-1 table style) ──
function _htSummaryBlock(html, delay) {
    _htAppend(`<div class="ht-summary-block">${html}</div>`, delay);
}

function htPlayDemo(n) {
    htClearTimers();
    document.getElementById('htAiWelcome').style.display = 'none';
    const chat = document.getElementById('htAiChat');
    chat.style.display = 'block';
    document.getElementById('htAiMessages').innerHTML = '';
    if (n === 1) _htDemo1();
    else if (n === 2) _htDemo2();
}

function htResetChat() {
    htClearTimers();
    document.getElementById('htAiWelcome').style.display = '';
    document.getElementById('htAiChat').style.display = 'none';
    document.getElementById('htAiMessages').innerHTML = '';
    document.querySelectorAll('.ht-ai-tool').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });
}

// ── Demo 1: 因子分析 ──────────────────────────────────────────────────
function _htDemo1() {
    let t = 400;

    _htUserMsg('新能源车企目前上险量维度的渠道库存压力趋势是怎么样的', t); t += 900;
    _htShowTyping(t); t += 1600; _htHideTyping(t);

    _htThinkStart('好的，正在调用因子 SKILL 计算新能源车企渠道库存水位。', 'D1', t); t += 500;
    const tools1 = [
        ['读取上险量数据',    'RIS/insurance_reg_2025',       312],
        ['读取产量数据',      'RIS/production_vol_2025',      248],
        ['读取出口量数据',    'RIS/export_vol_2025',          198],
        ['读取零售销量数据',  'RIS/retail_sales_2025',        276],
        ['计算累库因子',      'Factor/accum_inventory',        89],
        ['生成可视化图表',    'Renderer/chart_inventory',     143],
    ];
    tools1.forEach(([label, path, ms]) => { _htToolLine('D1', label, path, ms, t); t += 900; });
    _htThinkDone('D1', '<strong>分析完成！</strong>', t); t += 1200;

    _htDocReport(`
      <div class="ht-rdoc-hdr">
        <div class="ht-rdoc-title">新能源渠道库存压力周报：累库拐点初现</div>
        <div class="ht-rdoc-tag">行业追踪</div>
      </div>
      <div class="ht-rdoc-meta">2025年12月 &nbsp;|&nbsp; 新能源汽车</div>
      <div class="ht-rdoc-lead"><strong>核心观点：</strong>本周新能源渠道累库压力明显改善，比亚迪累库深度环比下降 30%，行业总累库量环比下降 7.2%，去化趋势初步确立。建议重点跟踪终端上险量与门店扩张匹配度，零公里二手车挂牌量为最佳领先指标。</div>
      <div class="ht-rdoc-sh">一、主要车企渠道库存水位（2025年12月）</div>
      <p class="ht-rdoc-body">截至 12 月末，头部品牌压力分化明显，比亚迪累库绝对量仍偏高但趋势向好，理想小幅上升需关注。</p>
      <table class="ht-rdoc-tbl">
        <thead><tr><th>车企</th><th>累库量（万辆）</th><th>累库深度</th><th>月环比</th></tr></thead>
        <tbody>
          <tr><td>比亚迪</td><td>13.77</td><td>中</td><td class="ht-rdoc-pos">-30%</td></tr>
          <tr><td>问界</td><td>2.36</td><td>低</td><td class="ht-rdoc-pos">-12%</td></tr>
          <tr><td>特斯拉</td><td>3.21</td><td>低</td><td class="ht-rdoc-pos">-8%</td></tr>
          <tr><td>理想</td><td>2.84</td><td>低</td><td class="ht-rdoc-neg">+5%</td></tr>
          <tr><td>小鹏</td><td>1.92</td><td>中</td><td class="ht-rdoc-pos">-15%</td></tr>
        </tbody>
      </table>
      <div class="ht-rdoc-sh">二、累库趋势（比亚迪 · 近12个月）</div>
      ${_htChartSVG()}
      <div class="ht-rdoc-chart-legend"><span class="ht-rdoc-leg-bar">累库量（万辆）</span><span class="ht-rdoc-leg-line">累库深度（%）</span></div>
      <div class="ht-rdoc-sh">三、推荐关注指标</div>
      <div class="ht-rdoc-bul"><strong>终端销量（上险量）</strong>：最直接的真实需求信号，优先于批发量</div>
      <div class="ht-rdoc-bul"><strong>车企门店数量</strong>：渠道扩张速度与压库关联，扩店快时需警惕隐性库存</div>
      <div class="ht-rdoc-bul"><strong>零公里二手车挂牌量</strong>：渠道去化压力的领先指标，领先正式数据 1-2 个月</div>
    `, t);
}

function _htChartSVG() {
    const vw = 310, vh = 130, pL = 30, pR = 8, pT = 8, pB = 22;
    const cW = vw - pL - pR, cH = vh - pT - pB, n = 12;
    const vol = [16.8,13.2,19.5,15.4,12.6,17.2,20.1,18.3,15.8,17.4,18.16,13.77];
    const dep = [42,35,48,39,32,43,51,46,40,44,52,36];
    const maxV = 22, maxD = 60, slot = cW / n, bw = slot * 0.55;
    let bars = '', pts = '', xlbl = '';
    for (let i = 0; i < n; i++) {
        const bx = pL + i * slot + (slot - bw) / 2;
        const bh = (vol[i] / maxV) * cH, by = pT + cH - bh;
        bars += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${i===11?'#4B85E6':'#C4D7F0'}"/>`;
        const lx = pL + i * slot + slot / 2, ly = pT + cH - (dep[i] / maxD) * cH;
        pts += `${lx.toFixed(1)},${ly.toFixed(1)} `;
        if (i % 3 === 0 || i === 11)
            xlbl += `<text x="${(pL+i*slot+slot/2).toFixed(1)}" y="${vh-4}" text-anchor="middle" font-size="8" fill="#AAB4C8">${i+1}月</text>`;
    }
    const yLines = [0,10,20].map(v => {
        const y = (pT + cH - (v/maxV)*cH).toFixed(1);
        return `<text x="${pL-3}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="7.5" fill="#C8CFD8">${v}</text><line x1="${pL}" y1="${y}" x2="${pL+cW}" y2="${y}" stroke="#F3F5F8" stroke-width="1"/>`;
    }).join('');
    const lbx = (pL + 11*slot + slot/2).toFixed(1), lby = (pT + cH - (vol[11]/maxV)*cH - 5).toFixed(1);
    return `<svg viewBox="0 0 ${vw} ${vh}" width="100%" style="margin:6px 0;">${yLines}${bars}<polyline points="${pts.trim()}" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>${xlbl}<text x="${lbx}" y="${lby}" text-anchor="middle" font-size="8" fill="#2D68FF" font-weight="bold">13.77</text></svg>`;
}

// ── Demo 2: 创建技能 ──────────────────────────────────────────────────
function _htDemo2() {
    let t = 400;

    _htAt(t, () => {
        document.querySelectorAll('.ht-ai-tool').forEach(b => {
            b.classList.toggle('active', b.textContent.includes('创建技能'));
        });
    }); t += 800;

    _htUserMsg('帮我生成一个新能源汽车行业销售潜力分析技能', t); t += 900;
    _htShowTyping(t); t += 1600; _htHideTyping(t);

    // Phase 1: Skill create
    _htThinkStart('好的，我来为你生成「新能源销售潜力分析」技能。', 'D2A', t); t += 500;
    [['解析需求', 'skill-create/parse_intent', 189],
     ['生成技能框架', 'skill-create/gen_framework', 312],
     ['配置数据源', 'skill-create/bind_datasource', 234],
     ['写入技能文件', 'skills/nev-sales-potential/SKILL.md', 198],
    ].forEach(([l, p, m]) => { _htToolLine('D2A', l, p, m, t); t += 900; });
    _htThinkDone('D2A', '<strong>技能已生成！</strong><br><span style="font-size:11px;color:#888;">请确认以下配置，确认后立即执行。</span>', t); t += 700;

    _htAppend(`<div class="ht-skill-card">
      <div class="ht-skill-card-title"><i class="fa-solid fa-puzzle-piece"></i> 新技能草稿 · 新能源销售潜力分析</div>
      <div class="ht-skill-module"><span class="ht-skill-module-num">1</span> 终端销量趋势分析</div>
      <div class="ht-skill-module"><span class="ht-skill-module-num">2</span> 渠道库存水位评估</div>
      <div class="ht-skill-module"><span class="ht-skill-module-num">3</span> 价格带分布与竞争分析</div>
      <div class="ht-skill-module"><span class="ht-skill-module-num">4</span> 下沉市场渗透率追踪</div>
      <div class="ht-skill-module"><span class="ht-skill-module-num">5</span> 竞品销量对比</div>
      <div class="ht-skill-actions">
        <button class="ht-skill-confirm-btn"><i class="fa-solid fa-check"></i> 确认执行</button>
        <button class="ht-skill-modify-btn"><i class="fa-solid fa-pen"></i> 修改</button>
      </div></div>`, t); t += 2200;

    _htUserMsg('确认执行', t); t += 900;
    _htShowTyping(t); t += 1600; _htHideTyping(t);

    // Phase 2: Execute skill
    _htThinkStart('好的，开始执行「新能源销售潜力分析」技能。', 'D2B', t); t += 500;
    [['执行模块 1  终端销量趋势分析',  'skills/nev-sales-potential/m1_terminal',   456],
     ['执行模块 2  渠道库存水位评估',  'skills/nev-sales-potential/m2_inventory',  398],
     ['执行模块 3  价格带分布分析',    'skills/nev-sales-potential/m3_pricebelt',  412],
     ['执行模块 4  下沉市场渗透追踪',  'skills/nev-sales-potential/m4_sinking',    387],
     ['执行模块 5  竞品销量对比',      'skills/nev-sales-potential/m5_competitor', 421],
     ['生成分析报告',                  'Renderer/report_generator',                267],
    ].forEach(([l, p, m]) => { _htToolLine('D2B', l, p, m, t); t += 900; });
    _htThinkDone('D2B', '<strong>技能执行完成！</strong>', t); t += 1200;

    _htDocReport(`
      <div class="ht-rdoc-hdr">
        <div class="ht-rdoc-title">新能源汽车销售潜力分析</div>
        <div class="ht-rdoc-tag">行业分析</div>
      </div>
      <div class="ht-rdoc-meta">2025年12月 &nbsp;|&nbsp; 新能源汽车</div>
      <div class="ht-rdoc-lead"><strong>核心观点：</strong>2025年全年终端增速 28.4%，旺季 12 月环比回升；20-30 万价格带竞争最为激烈，三四线城市渗透率快速提升至 29%，下沉市场成为核心增量来源。</div>
      <div class="ht-rdoc-sh">一、终端销量趋势（2025年12月）</div>
      <table class="ht-rdoc-tbl">
        <thead><tr><th>指标</th><th>本月</th><th>月环比</th><th>年同比</th></tr></thead>
        <tbody>
          <tr><td>终端销量（万辆）</td><td>39.4</td><td class="ht-rdoc-pos">+12.6%</td><td class="ht-rdoc-pos">+28.4%</td></tr>
          <tr><td>上险量（万辆）</td><td>38.7</td><td class="ht-rdoc-pos">+11.9%</td><td class="ht-rdoc-pos">+27.1%</td></tr>
          <tr><td>批发量（万辆）</td><td>43.2</td><td class="ht-rdoc-pos">+8.4%</td><td class="ht-rdoc-pos">+22.3%</td></tr>
          <tr><td>批零差（万辆）</td><td>4.5</td><td class="ht-rdoc-neg">+0.7</td><td class="ht-rdoc-neu">持平</td></tr>
        </tbody>
      </table>
      <div class="ht-rdoc-sh">二、价格带竞争格局</div>
      <table class="ht-rdoc-tbl">
        <thead><tr><th>价格带</th><th>主要竞争车型</th><th>份额变化</th></tr></thead>
        <tbody>
          <tr><td>15-20 万</td><td>比亚迪海豚 / 秦Plus EV</td><td class="ht-rdoc-neg">-2pp</td></tr>
          <tr><td>20-30 万</td><td>问界M5 / 理想L6 / 小米SU7</td><td class="ht-rdoc-pos">+5pp</td></tr>
          <tr><td>30 万+</td><td>问界M9 / 理想L9 / 蔚来ET9</td><td class="ht-rdoc-pos">+3pp</td></tr>
        </tbody>
      </table>
      <div class="ht-rdoc-sh">三、下沉市场渗透</div>
      <div class="ht-rdoc-bul"><strong>三四线城市新增上险量占比</strong>由 21% 升至 29%，增量市场重心持续下移</div>
      <div class="ht-rdoc-bul"><strong>县域新能源渗透率</strong>同比 +8pp，充电桩布局提速是核心催化剂</div>
    `, t); t += 2500;

    // User unsatisfied
    _htUserMsg('分析还不够全面，请增加「区域渗透率热力图」分析模块', t); t += 900;
    _htShowTyping(t); t += 1600; _htHideTyping(t);

    // Phase 3: Modify skill
    _htThinkStart('好的，我来修改 Skill 并进行测试验证。', 'D2C', t); t += 500;
    [['读取技能文件',  'skills/nev-sales-potential/SKILL.md',  178],
     ['新增分析模块',  'skill-create/add_module',               312],
     ['更新数据绑定',  'skill-create/bind_datasource',          198],
     ['写入技能文件',  'skills/nev-sales-potential/SKILL.md',  234],
    ].forEach(([l, p, m]) => { _htToolLine('D2C', l, p, m, t); t += 900; });
    _htThinkDone('D2C', '<strong>Skill 已修改完成！</strong>', t); t += 700;

    _htSummaryBlock(`
      <div class="ht-ms-label">修改摘要：</div>
      <table class="ht-ms-table">
        <thead><tr><th>修改项</th><th>变更内容</th></tr></thead>
        <tbody>
          <tr><td>新增步骤</td><td>增加了"第六步：区域渗透率热力图分析"</td></tr>
          <tr><td>分析维度</td><td>华东、华南、华中、西部、东北 5 大区域</td></tr>
          <tr><td>数据来源</td><td>省级上险量数据 + 渗透率计算模型</td></tr>
          <tr><td>输出格式</td><td>省份渗透率热力图 + TOP5 高潜力区域标注</td></tr>
        </tbody>
      </table>
      <p>下次执行"新能源销售潜力分析"时，报告将同时包含：</p>
      <ul>
        <li><strong>区域渗透率视角：</strong>省级渗透率热力图、高潜力市场识别</li>
        <li><strong>原有五大模块：</strong>终端销量 · 库存水位 · 价格带 · 下沉市场 · 竞品对比</li>
      </ul>
      <p>随时可以对"新能源销售潜力分析" skill 继续提出调整。</p>
    `, t); t += 1800;

    // Re-run
    _htThinkStart('好的，重新执行技能，新增区域渗透率模块。', 'D2D', t); t += 500;
    [['复用模块 1-5 缓存结果',        'skills/nev-sales-potential/cache',          89],
     ['执行模块 6  区域渗透率热力图',  'skills/nev-sales-potential/m6_regional',   612],
     ['生成更新报告',                  'Renderer/report_generator',                298],
    ].forEach(([l, p, m]) => { _htToolLine('D2D', l, p, m, t); t += 1000; });
    _htThinkDone('D2D', '<strong>技能执行完成！</strong>', t); t += 1200;

    _htDocReport(`
      <div class="ht-rdoc-hdr">
        <div class="ht-rdoc-title">新能源汽车销售潜力分析 · v2</div>
        <div class="ht-rdoc-tag">行业分析</div>
      </div>
      <div class="ht-rdoc-meta">2025年12月 &nbsp;|&nbsp; 新能源汽车 &nbsp;· 含区域渗透率模块</div>
      <div class="ht-rdoc-lead"><strong>核心观点：</strong>新增区域维度分析显示，华东/华南渗透率领先（35-42%），西部省份增速最快（+12pp）；建议优先布局西部及东北下沉市场，是下一阶段销量增量的核心来源。</div>
      <div class="ht-rdoc-sh">四、区域渗透率分析（新增）</div>
      <table class="ht-rdoc-tbl">
        <thead><tr><th>区域</th><th>渗透率</th><th>同比变化</th></tr></thead>
        <tbody>
          <tr><td>华东</td><td>42%</td><td class="ht-rdoc-pos">+8pp</td></tr>
          <tr><td>华南</td><td>38%</td><td class="ht-rdoc-pos">+7pp</td></tr>
          <tr><td>华中</td><td>28%</td><td class="ht-rdoc-pos">+9pp</td></tr>
          <tr><td>西部</td><td>14%</td><td class="ht-rdoc-pos">+12pp</td></tr>
          <tr><td>东北</td><td>18%</td><td class="ht-rdoc-pos">+6pp</td></tr>
        </tbody>
      </table>
      <div class="ht-rdoc-bul"><strong>新疆、甘肃、内蒙古</strong>渗透率同比增速最快（+12pp），是下一阶段重点布局区域</div>
      <div class="ht-rdoc-bul"><strong>一至三模块结论不变</strong>，完整报告见上方 v1 输出</div>
      <div class="ht-rdoc-bul" style="color:#059669; font-weight:500;">技能「新能源销售潜力分析 v2」已保存至技能库，可随时复用</div>
    `, t);
}

// ─────────────────────────────────────────────────────
// 热点事件传导分析 · D3 力导向图
// ─────────────────────────────────────────────────────
function initHteForceGraph() {
    const container = document.getElementById('hte-force-graph');
    if (!container || container.dataset.init || typeof d3 === 'undefined') return;
    container.dataset.init = '1';

    const W = container.clientWidth || 700;
    const H = 300;

    // ── Node & link data ──────────────────────────────
    const tierXPct = { trigger: 0.07, terminal: 0.23, t1: 0.46, t2: 0.67, material: 0.88 };
    const tierColor = {
        trigger:  '#D04A2E',
        terminal: '#E8725A',
        t1:       '#4B85E6',
        t2:       '#7C3AED',
        material: '#059669'
    };
    const strW = { strong: 3.5, mid: 2, weak: 1.1 };
    const strC = { strong: '#F97316', mid: '#4B85E6', weak: '#94A3B8' };
    const strO = { strong: 0.88, mid: 0.72, weak: 0.45 };

    const nodes = [
        { id: 'trigger', lines: ['关税政策', '升至145%'], tier: 'trigger',  r: 30 },
        { id: 'ev',      lines: ['新能源整车'],           tier: 'terminal', r: 25 },
        { id: 'battery', lines: ['动力电池组'],           tier: 't1',       r: 22 },
        { id: 'motor',   lines: ['电机/电控'],            tier: 't1',       r: 19 },
        { id: 'chip',    lines: ['芯片·MCU'],             tier: 't1',       r: 19 },
        { id: 'cell',    lines: ['电芯'],                 tier: 't2',       r: 21 },
        { id: 'cathode', lines: ['正极材料'],             tier: 't2',       r: 18 },
        { id: 'anode',   lines: ['负极材料'],             tier: 't2',       r: 16 },
        { id: 'sep',     lines: ['隔膜'],                 tier: 't2',       r: 14 },
        { id: 'elec',    lines: ['电解液'],               tier: 't2',       r: 14 },
        { id: 'licarb',  lines: ['碳酸锂'],              tier: 'material', r: 20 },
        { id: 'liore',   lines: ['锂精矿'],              tier: 'material', r: 16 },
    ];

    const links = [
        { source: 'trigger', target: 'ev',      strength: 'strong' },
        { source: 'ev',      target: 'battery', strength: 'strong' },
        { source: 'ev',      target: 'motor',   strength: 'mid'    },
        { source: 'ev',      target: 'chip',    strength: 'mid'    },
        { source: 'battery', target: 'cell',    strength: 'strong' },
        { source: 'cell',    target: 'cathode', strength: 'mid'    },
        { source: 'cell',    target: 'anode',   strength: 'mid'    },
        { source: 'cell',    target: 'sep',     strength: 'weak'   },
        { source: 'cell',    target: 'elec',    strength: 'weak'   },
        { source: 'cathode', target: 'licarb',  strength: 'mid'    },
        { source: 'licarb',  target: 'liore',   strength: 'weak'   },
    ];

    // Set guided initial positions
    const tierCount = {}, tierIdx = {};
    nodes.forEach(n => { tierCount[n.tier] = (tierCount[n.tier] || 0) + 1; });
    nodes.forEach(n => {
        if (tierIdx[n.tier] === undefined) tierIdx[n.tier] = 0;
        const idx = tierIdx[n.tier]++;
        const cnt = tierCount[n.tier];
        n.x = tierXPct[n.tier] * W;
        n.y = H / 2 + (cnt > 1 ? ((idx / (cnt - 1)) - 0.5) * (H * 0.72) : 0);
    });

    // ── SVG setup ──────────────────────────────────────
    const svg = d3.select(container)
        .append('svg')
        .attr('width', W).attr('height', H)
        .style('display', 'block').style('border-radius', '8px');

    svg.append('rect').attr('width', W).attr('height', H)
        .attr('fill', '#F9FAFB').attr('rx', 8);

    // Arrowhead markers (one per strength level)
    const defs = svg.append('defs');
    Object.entries(strC).forEach(([s, color]) => {
        defs.append('marker')
            .attr('id', `hte-arr-${s}`)
            .attr('viewBox', '-8 -3.5 8 7')
            .attr('refX', 0).attr('refY', 0)
            .attr('markerWidth', 5).attr('markerHeight', 5)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M -8,-3.5 L 0,0 L -8,3.5 Z').attr('fill', color);
    });

    // ── Force simulation ──────────────────────────────
    const sim = d3.forceSimulation(nodes)
        .force('link',    d3.forceLink(links).id(d => d.id).distance(95).strength(0.55))
        .force('charge',  d3.forceManyBody().strength(-220))
        .force('x',       d3.forceX(d => tierXPct[d.tier] * W).strength(0.42))
        .force('y',       d3.forceY(H / 2).strength(0.04))
        .force('collide', d3.forceCollide(d => d.r + 11));

    // ── Edges ─────────────────────────────────────────
    const linkEls = svg.append('g').attr('class', 'hte-links')
        .selectAll('line').data(links).join('line')
        .attr('stroke',         d => strC[d.strength])
        .attr('stroke-width',   d => strW[d.strength])
        .attr('stroke-opacity', d => strO[d.strength])
        .attr('marker-end',     d => `url(#hte-arr-${d.strength})`);

    // ── Node groups ───────────────────────────────────
    const nodeG = svg.append('g').attr('class', 'hte-nodes')
        .selectAll('g').data(nodes).join('g')
        .style('cursor', 'grab')
        .call(d3.drag()
            .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
            .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
            .on('end',   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    // Glow halo
    nodeG.append('circle')
        .attr('r', d => d.r + 5)
        .attr('fill', d => tierColor[d.tier])
        .attr('opacity', 0.09);

    // Main circle
    nodeG.append('circle')
        .attr('r', d => d.r)
        .attr('fill', d => tierColor[d.tier] + '1A')
        .attr('stroke', d => tierColor[d.tier])
        .attr('stroke-width', 1.8);

    // Text labels
    nodeG.each(function(d) {
        const g = d3.select(this);
        if (d.lines.length === 1) {
            g.append('text')
                .attr('text-anchor', 'middle').attr('dy', '0.35em')
                .attr('font-size', d.r < 17 ? '9px' : '10px')
                .attr('font-weight', '700')
                .attr('fill', tierColor[d.tier])
                .attr('font-family', 'PingFang SC, Helvetica, sans-serif')
                .text(d.lines[0]);
        } else {
            const t = g.append('text').attr('text-anchor', 'middle')
                .attr('font-family', 'PingFang SC, Helvetica, sans-serif');
            d.lines.forEach((line, i) => {
                t.append('tspan')
                    .attr('x', 0)
                    .attr('dy', i === 0 ? `${-(d.lines.length - 1) * 0.55}em` : '1.2em')
                    .attr('font-size', '9.5px').attr('font-weight', '700')
                    .attr('fill', tierColor[d.tier])
                    .text(line);
            });
        }
    });

    // ── Tick ──────────────────────────────────────────
    sim.on('tick', () => {
        // Clamp nodes within bounds
        nodes.forEach(d => {
            d.x = Math.max(d.r + 4, Math.min(W - d.r - 4, d.x));
            d.y = Math.max(d.r + 4, Math.min(H - d.r - 4, d.y));
        });

        // Draw edges from source-edge to target-edge
        linkEls
            .attr('x1', d => {
                const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                return d.source.x + (dx / dist) * d.source.r;
            })
            .attr('y1', d => {
                const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                return d.source.y + (dy / dist) * d.source.r;
            })
            .attr('x2', d => {
                const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                return d.target.x - (dx / dist) * d.target.r;
            })
            .attr('y2', d => {
                const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                return d.target.y - (dy / dist) * d.target.r;
            });

        nodeG.attr('transform', d => `translate(${d.x},${d.y})`);
    });
}

// ─────────────────────────────────────────────────────
// 销售潜力分析 — 四图面板
// ─────────────────────────────────────────────────────
const SP_BRANDS  = ['比亚迪','理想汽车','问界','小鹏汽车','蔚来汽车','特斯拉中国','上汽集团','广汽集团','吉利汽车','长安汽车','零跑汽车','极氪汽车','深蓝汽车','奇瑞汽车','长城汽车'];
const SP_COLORS  = ['#4B85E6','#F97316','#22C55E','#9333EA','#06B6D4','#EF4444','#84CC16','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#6366F1','#D97706','#65A30D','#BE185D'];
const SP_MONTHS  = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const SP_DEFAULT = ['比亚迪','理想汽车','问界','小鹏汽车','蔚来汽车','特斯拉中国'];

const SP_STORE = {'比亚迪':[3800,3850,3900,3920,3980,4050,4100,4120,4200,4350,4420,4471],'理想汽车':[468,472,478,485,491,498,505,512,518,524,530,535],'问界':[312,325,338,352,368,384,395,408,419,432,445,458],'小鹏汽车':[285,288,292,298,305,312,318,325,331,338,344,350],'蔚来汽车':[425,428,432,438,445,452,458,465,472,478,484,490],'特斯拉中国':[198,200,205,210,215,220,225,230,235,240,245,250],'上汽集团':[1820,1810,1800,1785,1770,1755,1742,1730,1718,1706,1695,1685],'广汽集团':[920,915,910,905,900,896,892,888,884,880,876,872],'吉利汽车':[1245,1250,1258,1265,1272,1280,1288,1295,1302,1310,1317,1325],'长安汽车':[1050,1055,1062,1068,1075,1082,1088,1095,1102,1108,1115,1122],'零跑汽车':[265,272,280,288,296,305,313,322,330,338,346,354],'极氪汽车':[238,244,251,258,265,272,278,285,292,298,305,312],'深蓝汽车':[195,202,210,218,226,234,241,248,256,263,270,278],'奇瑞汽车':[1560,1555,1550,1545,1540,1535,1530,1525,1520,1515,1510,1505],'长城汽车':[1380,1375,1370,1365,1360,1356,1352,1348,1344,1340,1336,1332]};
const SP_DISC   = {'比亚迪':[2.1,2.3,2.8,3.1,2.9,2.5,2.3,2.1,1.8,1.5,1.4,1.2],'理想汽车':[1.2,1.3,1.5,1.8,1.6,1.5,1.4,1.3,1.2,1.1,1.0,0.9],'问界':[1.8,2.0,2.5,2.8,2.6,2.4,2.2,2.0,1.9,1.7,1.6,1.5],'小鹏汽车':[3.5,3.8,4.2,4.5,4.3,4.0,3.8,3.6,3.4,3.2,3.0,2.8],'蔚来汽车':[2.8,3.0,3.4,3.7,3.5,3.3,3.1,2.9,2.7,2.6,2.4,2.3],'特斯拉中国':[0.5,0.6,0.8,1.0,0.9,0.8,0.7,0.6,0.5,0.5,0.4,0.4],'上汽集团':[5.2,5.5,6.0,6.4,6.2,5.9,5.7,5.5,5.3,5.1,4.9,4.8],'广汽集团':[4.8,5.1,5.5,5.8,5.6,5.4,5.2,5.0,4.8,4.6,4.5,4.3],'吉利汽车':[3.2,3.4,3.8,4.1,3.9,3.7,3.5,3.3,3.1,3.0,2.9,2.8],'长安汽车':[3.8,4.0,4.4,4.7,4.5,4.3,4.1,3.9,3.7,3.5,3.3,3.2],'零跑汽车':[4.2,4.5,5.0,5.3,5.1,4.8,4.6,4.4,4.2,4.0,3.8,3.6],'极氪汽车':[2.5,2.7,3.1,3.4,3.2,3.0,2.8,2.6,2.5,2.3,2.2,2.1],'深蓝汽车':[4.0,4.3,4.7,5.0,4.8,4.6,4.4,4.2,4.0,3.8,3.6,3.5],'奇瑞汽车':[3.6,3.8,4.2,4.5,4.3,4.1,3.9,3.7,3.5,3.3,3.2,3.1],'长城汽车':[4.5,4.8,5.2,5.5,5.3,5.1,4.9,4.7,4.5,4.3,4.2,4.1]};
const SP_INS    = {'比亚迪':[42.1,38.5,45.2,42.8,48.3,51.2,49.8,52.1,50.4,54.3,48.2,46.3],'理想汽车':[9.8,8.2,11.2,10.5,12.8,13.4,12.9,13.8,12.4,13.2,11.8,11.6],'问界':[5.2,4.8,6.4,6.0,7.2,7.8,7.5,8.1,7.6,8.4,7.9,7.6],'小鹏汽车':[2.8,2.5,3.4,3.2,4.1,4.5,4.3,4.8,4.5,5.0,4.6,4.4],'蔚来汽车':[3.5,3.1,4.2,3.9,4.8,5.2,5.0,5.5,5.1,5.6,5.2,5.0],'特斯拉中国':[6.8,5.9,7.8,7.3,8.5,9.2,8.8,9.5,8.9,9.8,8.4,7.3],'上汽集团':[12.8,11.5,14.2,13.5,15.8,16.5,16.0,17.2,15.8,17.8,15.5,14.0],'广汽集团':[8.5,7.8,9.5,8.9,10.4,11.2,10.8,11.5,10.9,11.8,10.2,9.1],'吉利汽车':[7.8,7.2,8.8,8.3,9.6,10.2,9.8,10.5,9.9,10.8,9.5,8.9],'长安汽车':[6.5,5.9,7.5,7.1,8.3,8.9,8.5,9.2,8.7,9.5,8.2,7.8],'零跑汽车':[1.8,1.6,2.1,2.0,2.5,2.8,2.6,2.9,2.7,3.0,2.7,2.5],'极氪汽车':[2.5,2.2,3.0,2.8,3.4,3.7,3.5,3.8,3.6,3.9,3.5,3.2],'深蓝汽车':[1.5,1.4,1.8,1.7,2.1,2.3,2.2,2.5,2.3,2.6,2.3,2.1],'奇瑞汽车':[5.8,5.2,6.5,6.1,7.2,7.8,7.5,8.0,7.5,8.2,7.1,6.8],'长城汽车':[4.8,4.4,5.5,5.2,6.1,6.6,6.3,6.8,6.4,7.0,6.1,5.8]};
const SP_RET    = {'比亚迪':[41.8,38.2,44.9,42.5,48.0,50.8,49.4,51.7,50.1,53.9,47.9,46.0],'理想汽车':[9.7,8.1,11.1,10.4,12.7,13.3,12.8,13.7,12.3,13.1,11.7,11.6],'问界':[5.1,4.7,6.3,5.9,7.1,7.7,7.4,8.0,7.5,8.3,7.8,7.5],'小鹏汽车':[2.7,2.4,3.3,3.1,4.0,4.4,4.2,4.7,4.4,4.9,4.5,4.3],'蔚来汽车':[3.4,3.0,4.1,3.8,4.7,5.1,4.9,5.4,5.0,5.5,5.1,4.9],'特斯拉中国':[6.7,5.8,7.7,7.2,8.4,9.1,8.7,9.4,8.8,9.7,8.3,7.3],'上汽集团':[11.5,10.3,12.8,12.1,14.2,15.0,14.5,15.8,14.4,16.2,14.1,14.0],'广汽集团':[7.8,7.1,8.8,8.2,9.6,10.4,10.0,10.8,10.2,11.1,9.5,9.1],'吉利汽车':[7.5,6.9,8.5,8.0,9.3,9.9,9.5,10.2,9.6,10.5,9.2,8.9],'长安汽车':[6.1,5.5,7.0,6.7,7.8,8.4,8.1,8.7,8.2,9.0,7.8,7.8],'零跑汽车':[1.7,1.5,2.0,1.9,2.4,2.7,2.5,2.8,2.6,2.9,2.6,2.5],'极氪汽车':[2.4,2.1,2.9,2.7,3.3,3.6,3.4,3.7,3.5,3.8,3.4,3.2],'深蓝汽车':[1.4,1.3,1.7,1.6,2.0,2.2,2.1,2.4,2.2,2.5,2.2,2.1],'奇瑞汽车':[5.5,4.9,6.1,5.8,6.8,7.4,7.1,7.6,7.1,7.8,6.8,6.8],'长城汽车':[4.5,4.1,5.2,4.9,5.8,6.3,6.0,6.5,6.1,6.7,5.8,5.8]};
const SP_MOIST  = {'比亚迪':[0.7,0.8,0.7,0.7,0.6,0.8,0.8,0.8,0.6,0.7,0.6,0.6],'理想汽车':[0.4,0.4,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.3],'问界':[0.8,0.9,1.1,1.2,1.0,0.9,0.8,0.8,0.7,0.7,0.6,0.6],'小鹏汽车':[1.2,1.3,1.5,1.5,1.4,1.3,1.2,1.1,1.0,1.0,0.9,0.9],'蔚来汽车':[1.0,1.0,1.1,1.1,1.0,1.0,1.0,0.9,0.9,0.9,0.8,0.8],'特斯拉中国':[0.3,0.3,0.4,0.4,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.2],'上汽集团':[3.5,3.8,4.2,4.5,4.3,4.1,3.9,3.8,3.6,3.4,3.3,3.3],'广汽集团':[3.0,3.2,3.6,3.9,3.7,3.5,3.4,3.2,3.1,2.9,2.8,2.7],'吉利汽车':[2.2,2.4,2.7,2.9,2.8,2.7,2.6,2.5,2.4,2.3,2.2,2.1],'长安汽车':[2.5,2.7,3.0,3.2,3.1,3.0,2.9,2.8,2.7,2.6,2.5,2.4],'零跑汽车':[1.5,1.7,1.9,2.1,2.0,1.9,1.8,1.7,1.6,1.5,1.5,1.4],'极氪汽车':[1.8,2.0,2.2,2.4,2.3,2.2,2.1,2.0,1.9,1.8,1.7,1.6],'深蓝汽车':[1.9,2.1,2.3,2.5,2.4,2.3,2.2,2.1,2.0,1.9,1.8,1.7],'奇瑞汽车':[2.8,3.0,3.4,3.6,3.5,3.4,3.3,3.2,3.1,3.0,2.9,2.8],'长城汽车':[3.2,3.4,3.8,4.0,3.9,3.7,3.6,3.5,3.4,3.2,3.1,3.0]};
const SP_ZVOL   = {'比亚迪':[120,145,168,192,210,238,225,198,175,152,138,125],'理想汽车':[25,28,32,38,42,48,44,38,33,28,25,22],'问界':[42,48,55,62,68,75,70,62,56,50,45,41],'小鹏汽车':[55,62,70,78,85,92,88,80,73,66,60,55],'蔚来汽车':[48,54,61,68,74,82,78,70,64,57,52,48],'特斯拉中国':[15,18,22,26,29,33,30,26,23,20,17,15],'上汽集团':[180,205,232,258,280,305,288,262,238,215,195,178],'广汽集团':[145,165,188,210,228,248,232,210,191,172,157,142],'吉利汽车':[110,125,142,158,172,188,175,159,144,130,118,108],'长安汽车':[98,112,128,142,155,168,158,143,130,117,106,97],'零跑汽车':[62,70,80,90,98,107,101,92,83,75,68,62],'极氪汽车':[38,43,50,56,62,68,64,58,52,47,42,38],'深蓝汽车':[45,51,58,65,71,78,73,66,60,54,49,44],'奇瑞汽车':[135,152,172,192,208,226,212,193,175,158,143,130],'长城汽车':[128,145,165,184,200,217,204,185,168,152,138,125]};
const SP_ZIDX   = {'比亚迪':[2.1,2.4,2.8,3.1,3.4,3.8,3.5,3.0,2.7,2.3,2.1,1.9],'理想汽车':[1.2,1.3,1.5,1.8,2.0,2.3,2.1,1.8,1.6,1.4,1.2,1.1],'问界':[1.5,1.7,2.0,2.2,2.5,2.8,2.6,2.2,2.0,1.8,1.6,1.5],'小鹏汽车':[2.5,2.7,3.0,3.3,3.5,3.8,3.6,3.3,3.0,2.7,2.5,2.3],'蔚来汽车':[2.0,2.2,2.5,2.7,3.0,3.3,3.1,2.7,2.4,2.2,2.0,1.9],'特斯拉中国':[0.8,0.9,1.1,1.3,1.4,1.6,1.5,1.3,1.1,1.0,0.9,0.8],'上汽集团':[3.8,4.2,4.7,5.1,5.5,6.0,5.7,5.1,4.6,4.2,3.8,3.5],'广汽集团':[3.5,3.9,4.3,4.7,5.1,5.5,5.2,4.7,4.2,3.8,3.5,3.2],'吉利汽车':[3.0,3.4,3.8,4.1,4.5,4.9,4.6,4.1,3.7,3.3,3.0,2.8],'长安汽车':[2.8,3.1,3.5,3.8,4.2,4.5,4.3,3.8,3.4,3.1,2.8,2.6],'零跑汽车':[2.3,2.6,2.9,3.2,3.5,3.8,3.6,3.2,2.9,2.6,2.3,2.1],'极氪汽车':[1.8,2.0,2.3,2.6,2.8,3.1,2.9,2.6,2.3,2.1,1.9,1.7],'深蓝汽车':[2.2,2.4,2.8,3.0,3.3,3.6,3.4,3.0,2.7,2.4,2.2,2.0],'奇瑞汽车':[3.2,3.6,4.0,4.4,4.8,5.2,4.9,4.4,3.9,3.5,3.2,2.9],'长城汽车':[3.4,3.8,4.2,4.6,5.0,5.4,5.1,4.6,4.1,3.7,3.4,3.1]};
const SP_ZDISC  = {'比亚迪':[-4.2,-4.5,-4.8,-5.1,-5.4,-5.8,-5.5,-5.0,-4.7,-4.3,-4.1,-3.8],'理想汽车':[-2.1,-2.3,-2.5,-2.8,-3.0,-3.3,-3.1,-2.8,-2.5,-2.2,-2.0,-1.8],'问界':[-3.1,-3.4,-3.7,-4.0,-4.2,-4.5,-4.3,-4.0,-3.7,-3.4,-3.1,-2.9],'小鹏汽车':[-5.5,-5.8,-6.2,-6.5,-6.7,-7.0,-6.8,-6.4,-6.1,-5.7,-5.4,-5.1],'蔚来汽车':[-4.5,-4.8,-5.1,-5.4,-5.6,-5.9,-5.7,-5.3,-5.0,-4.7,-4.4,-4.2],'特斯拉中国':[-1.5,-1.7,-1.9,-2.1,-2.2,-2.4,-2.3,-2.1,-1.9,-1.7,-1.6,-1.4],'上汽集团':[-6.5,-6.8,-7.2,-7.6,-8.0,-8.4,-8.0,-7.5,-7.0,-6.5,-6.2,-5.8],'广汽集团':[-6.0,-6.3,-6.7,-7.1,-7.5,-7.8,-7.5,-7.0,-6.5,-6.0,-5.7,-5.4],'吉利汽车':[-4.8,-5.1,-5.4,-5.7,-6.0,-6.3,-6.0,-5.6,-5.3,-4.9,-4.7,-4.4],'长安汽车':[-5.2,-5.5,-5.9,-6.2,-6.5,-6.8,-6.5,-6.1,-5.7,-5.3,-5.0,-4.8],'零跑汽车':[-5.8,-6.1,-6.5,-6.8,-7.1,-7.4,-7.2,-6.7,-6.3,-5.9,-5.6,-5.3],'极氪汽车':[-3.8,-4.1,-4.4,-4.7,-5.0,-5.3,-5.0,-4.7,-4.3,-4.0,-3.8,-3.5],'深蓝汽车':[-5.5,-5.8,-6.2,-6.5,-6.8,-7.1,-6.8,-6.4,-6.0,-5.6,-5.3,-5.0],'奇瑞汽车':[-5.0,-5.3,-5.7,-6.0,-6.3,-6.6,-6.3,-5.9,-5.5,-5.1,-4.9,-4.6],'长城汽车':[-5.5,-5.8,-6.2,-6.6,-6.9,-7.2,-6.9,-6.4,-6.0,-5.6,-5.3,-5.0]};
const SP_NEWCARS = [
    {brand:'小米',model:'SU7 Ultra',fuel:'BEV',month:'10月',att:'极高',lv:4},
    {brand:'蔚来',model:'ET9',fuel:'BEV',month:'10月',att:'极高',lv:4},
    {brand:'比亚迪',model:'汉EV 2026款',fuel:'BEV',month:'10月',att:'高',lv:3},
    {brand:'问界',model:'M9 Ultra',fuel:'EREV',month:'11月',att:'高',lv:3},
    {brand:'理想',model:'L9 PRO',fuel:'EREV',month:'11月',att:'高',lv:3},
    {brand:'特斯拉',model:'Model Y Juniper',fuel:'BEV',month:'11月',att:'高',lv:3},
    {brand:'极氪',model:'001 FR',fuel:'BEV',month:'11月',att:'高',lv:3},
    {brand:'小鹏',model:'X9 改款',fuel:'BEV',month:'11月',att:'中',lv:2},
    {brand:'深蓝',model:'G318',fuel:'PHEV',month:'12月',att:'中',lv:2},
    {brand:'零跑',model:'C16',fuel:'EREV',month:'12月',att:'中',lv:2},
    {brand:'长安',model:'启源E07',fuel:'BEV',month:'12月',att:'中',lv:2},
    {brand:'阿维塔',model:'07',fuel:'BEV',month:'12月',att:'中',lv:2},
    {brand:'奇瑞',model:'星纪元ET',fuel:'BEV',month:'12月',att:'中',lv:2},
    {brand:'岚图',model:'知音',fuel:'PHEV',month:'12月',att:'低',lv:1},
    {brand:'广汽',model:'传祺E9',fuel:'PHEV',month:'12月',att:'低',lv:1},
];

function spColor(brand) { return SP_COLORS[SP_BRANDS.indexOf(brand)] || '#888'; }

function spMakeSelector(cid, cb) {
    const el = document.getElementById(cid);
    if (!el) return;
    el._sel = [...SP_DEFAULT];
    SP_BRANDS.forEach((b, i) => {
        const p = document.createElement('span');
        p.className = 'sp-brand-pill';
        p.textContent = b;
        const c = SP_COLORS[i];
        const on = SP_DEFAULT.includes(b);
        p.style.cssText = on ? `border-color:${c};color:${c};background:${c}22;font-weight:600` : '';
        p.onclick = () => {
            const s = el._sel, idx = s.indexOf(b);
            if (idx === -1) { if (s.length >= 6) s.shift(); s.push(b); }
            else { if (s.length <= 1) return; s.splice(idx, 1); }
            el.querySelectorAll('.sp-brand-pill').forEach((pp, j) => {
                const cc = SP_COLORS[j], active = s.includes(SP_BRANDS[j]);
                pp.style.cssText = active ? `border-color:${cc};color:${cc};background:${cc}22;font-weight:600` : '';
            });
            cb(s);
        };
        el.appendChild(p);
    });
}

const spAxis = {
    type:'category', data:SP_MONTHS,
    axisLabel:{fontSize:10,color:'#999'},
    axisLine:{lineStyle:{color:'#EAECF2'}},
    axisTick:{show:false}
};
const spGrid = {top:28,right:58,bottom:28,left:52};
const spTooltip = {trigger:'axis',axisPointer:{type:'cross'},textStyle:{fontSize:11}};

function spLine(name,data,yIdx,color,dash){
    return {name,type:'line',yAxisIndex:yIdx,data,smooth:true,symbol:'circle',symbolSize:3,
        lineStyle:{color,width:dash?1.5:2,type:dash||'solid'},itemStyle:{color}};
}
function spYL(name){return {type:'value',name,nameTextStyle:{fontSize:9,color:'#AAB4C8'},nameGap:4,axisLabel:{fontSize:10,color:'#999'},splitLine:{lineStyle:{color:'#F0F2F8'}}};}
function spYR(name,fmt){return {type:'value',name,nameTextStyle:{fontSize:9,color:'#AAB4C8'},nameGap:4,axisLabel:{fontSize:10,color:'#999',formatter:fmt||'{value}%'},splitLine:{show:false}};}

function spChart(id){ return echarts.getInstanceByDom(document.getElementById(id)) || echarts.init(document.getElementById(id)); }

function spSetChart1(sel) {
    spChart('sp-chart-1').setOption({
        backgroundColor:'transparent', grid:spGrid, tooltip:spTooltip, legend:{show:false},
        xAxis:spAxis,
        yAxis:[spYL('门店数'),spYR('折扣率%')],
        series:[
            ...sel.map(b => spLine(b+'·门店', SP_STORE[b]||[], 0, spColor(b))),
            ...sel.map(b => spLine(b+'·折扣', SP_DISC[b]||[], 1, spColor(b), 'dashed')),
        ]
    }, true);
}
function spSetChart2(sel) {
    spChart('sp-chart-2').setOption({
        backgroundColor:'transparent', grid:spGrid, tooltip:spTooltip, legend:{show:false},
        xAxis:spAxis,
        yAxis:[spYL('万辆'),spYR('水分占比%')],
        series:[
            ...sel.map(b => spLine(b+'·上险量', SP_INS[b]||[], 0, spColor(b))),
            ...sel.map(b => spLine(b+'·零售量', SP_RET[b]||[], 0, spColor(b), 'dashed')),
            ...sel.map(b => spLine(b+'·水分', SP_MOIST[b]||[], 1, spColor(b), 'dotted')),
        ]
    }, true);
}
function spSetChart3(sel) {
    spChart('sp-chart-3').setOption({
        backgroundColor:'transparent', grid:spGrid, tooltip:spTooltip, legend:{show:false},
        xAxis:spAxis,
        yAxis:[spYL('挂牌量(辆)'),spYR('指数/折扣%')],
        series:[
            ...sel.map(b => spLine(b+'·挂牌量', SP_ZVOL[b]||[], 0, spColor(b))),
            ...sel.map(b => spLine(b+'·程度', SP_ZIDX[b]||[], 1, spColor(b), 'dashed')),
            ...sel.map(b => spLine(b+'·折扣', SP_ZDISC[b]||[], 1, spColor(b), 'dotted')),
        ]
    }, true);
}

function spBuildNewCars() {
    const g = document.getElementById('sp-newcar-grid');
    if (!g) return;
    const fc = {BEV:'#3B82F6',PHEV:'#10B981',EREV:'#F97316'};
    const ac = {4:'#EF4444',3:'#F97316',2:'#6B7280',1:'#D1D5DB'};
    g.innerHTML = SP_NEWCARS.map(c => `
        <div class="sp-nc-card">
            <div class="sp-nc-top">
                <span class="sp-nc-brand">${c.brand}</span>
                <span class="sp-nc-fuel" style="background:${fc[c.fuel]}22;color:${fc[c.fuel]}">${c.fuel}</span>
            </div>
            <div class="sp-nc-model">${c.model}</div>
            <div class="sp-nc-bot">
                <span class="sp-nc-month">${c.month}发布</span>
                <span class="sp-nc-att" style="color:${ac[c.lv]}">${'●'.repeat(c.lv)}${'○'.repeat(4-c.lv)} ${c.att}</span>
            </div>
        </div>`).join('');
}

function initSalesPanels() {
    if (document.getElementById('sp-chart-1').dataset.init) return;
    document.getElementById('sp-chart-1').dataset.init = '1';
    spMakeSelector('sp1-brands', spSetChart1);
    spMakeSelector('sp2-brands', spSetChart2);
    spMakeSelector('sp3-brands', spSetChart3);
    spSetChart1(SP_DEFAULT);
    spSetChart2(SP_DEFAULT);
    spSetChart3(SP_DEFAULT);
    spBuildNewCars();
}

// ============================================================
// 库存压力分析 Charts
// ============================================================
const INV_BRANDS = ['比亚迪','吉利汽车','广汽集团','长安汽车','上汽集团','特斯拉','理想汽车','蔚来','小鹏汽车','零跑汽车','华为问界','小米汽车','奇瑞汽车','长城汽车','哪吒汽车'];
const INV_DEFAULT = ['比亚迪','理想汽车','广汽集团','长安汽车'];
const INV_MONTHS = ['3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月'];

// 库存周转天数
const INV_DAYS = {
    '比亚迪':   [16,15,14,13,14,15,14,13,14,15,14,15],
    '吉利汽车': [32,34,33,35,36,38,38,37,36,35,34,35],
    '广汽集团': [52,55,58,60,62,65,68,65,62,60,58,58],
    '长安汽车': [42,44,46,48,50,52,50,48,47,47,46,45],
    '上汽集团': [38,40,42,44,46,48,46,44,42,43,42,41],
    '特斯拉':   [20,21,19,18,20,22,21,20,19,18,18,19],
    '理想汽车': [18,17,18,19,18,17,18,19,18,18,18,17],
    '蔚来':     [45,47,50,52,55,58,56,54,52,50,48,47],
    '小鹏汽车': [48,50,52,55,58,60,58,56,54,52,50,49],
    '零跑汽车': [36,38,40,42,44,46,44,42,40,38,37,36],
    '华为问界': [22,24,22,21,20,22,22,21,20,19,18,18],
    '小米汽车': [12,11,10,11,12,13,12,11,10,10,10,10],
    '奇瑞汽车': [40,42,44,46,48,50,48,46,44,42,40,40],
    '长城汽车': [44,46,48,50,52,54,52,50,48,46,44,43],
    '哪吒汽车': [62,65,68,72,75,78,76,74,72,70,68,67],
};

// 渠道库存系数（>1.5为警戒线）
const INV_COEF = {
    '比亚迪':   [0.6,0.6,0.5,0.5,0.5,0.6,0.5,0.5,0.5,0.6,0.5,0.5],
    '吉利汽车': [1.1,1.2,1.1,1.2,1.3,1.4,1.4,1.3,1.3,1.2,1.2,1.2],
    '广汽集团': [1.8,1.9,2.0,2.1,2.2,2.3,2.4,2.2,2.1,2.1,2.0,2.0],
    '长安汽车': [1.5,1.6,1.7,1.7,1.8,1.9,1.8,1.7,1.7,1.7,1.6,1.6],
    '上汽集团': [1.3,1.4,1.5,1.6,1.7,1.8,1.7,1.6,1.5,1.5,1.5,1.4],
    '特斯拉':   [0.7,0.8,0.7,0.7,0.7,0.8,0.8,0.7,0.7,0.7,0.7,0.7],
    '理想汽车': [0.6,0.6,0.7,0.7,0.6,0.6,0.7,0.7,0.6,0.6,0.6,0.6],
    '蔚来':     [1.6,1.7,1.8,1.9,2.0,2.1,2.0,1.9,1.8,1.8,1.7,1.7],
    '小鹏汽车': [1.7,1.8,1.9,2.0,2.1,2.2,2.1,2.0,1.9,1.8,1.8,1.7],
    '零跑汽车': [1.3,1.4,1.4,1.5,1.6,1.7,1.6,1.5,1.4,1.4,1.3,1.3],
    '华为问界': [0.8,0.9,0.8,0.8,0.7,0.8,0.8,0.7,0.7,0.7,0.7,0.7],
    '小米汽车': [0.4,0.4,0.4,0.4,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4],
    '奇瑞汽车': [1.4,1.5,1.6,1.7,1.7,1.8,1.7,1.6,1.5,1.5,1.4,1.4],
    '长城汽车': [1.6,1.7,1.7,1.8,1.9,2.0,1.9,1.8,1.7,1.6,1.6,1.5],
    '哪吒汽车': [2.2,2.3,2.4,2.6,2.7,2.8,2.7,2.6,2.5,2.4,2.4,2.3],
};

// 产销率 %
const INV_PSR = {
    '比亚迪':   [98,99,100,101,100,99,100,101,100,100,99,100],
    '吉利汽车': [96,95,96,95,94,93,94,95,96,96,97,96],
    '广汽集团': [88,86,84,82,80,78,79,81,83,84,85,86],
    '长安汽车': [92,91,90,90,88,87,88,89,90,91,92,92],
    '上汽集团': [94,93,92,91,90,89,90,91,92,93,93,94],
    '特斯拉':   [97,98,99,100,98,97,98,99,100,100,99,99],
    '理想汽车': [99,100,100,100,101,100,100,100,100,100,100,100],
    '蔚来':     [90,89,88,87,86,85,86,87,88,89,90,91],
    '小鹏汽车': [88,87,86,85,84,83,84,85,86,87,88,89],
    '零跑汽车': [94,93,92,91,90,89,90,91,92,93,94,95],
    '华为问界': [98,97,98,99,100,99,99,100,100,100,100,100],
    '小米汽车': [101,102,103,102,101,100,101,102,103,103,102,102],
    '奇瑞汽车': [93,92,91,90,89,88,89,90,91,92,93,93],
    '长城汽车': [91,90,89,88,87,86,87,88,89,90,91,92],
    '哪吒汽车': [80,78,76,74,72,70,71,72,74,75,76,77],
};

function invColor(b) { return SP_COLORS[INV_BRANDS.indexOf(b)] || SP_COLORS[SP_BRANDS.indexOf(b)] || '#888'; }

function invMakeSelector(containerId, callback, maxSel) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    let active = INV_DEFAULT.slice();
    INV_BRANDS.forEach(b => {
        const pill = document.createElement('span');
        pill.className = 'inv-brand-pill' + (active.includes(b) ? ' active' : '');
        pill.textContent = b;
        const c = invColor(b);
        if (active.includes(b)) pill.style.cssText = `background:${c};border-color:${c}`;
        pill.addEventListener('click', () => {
            if (pill.classList.contains('active')) {
                if (active.length <= 1) return;
                active = active.filter(x => x !== b);
                pill.classList.remove('active');
                pill.style.cssText = '';
            } else {
                const max = maxSel || 6;
                if (active.length >= max) return;
                active.push(b);
                pill.classList.add('active');
                pill.style.cssText = `background:${c};border-color:${c}`;
            }
            callback(active);
        });
        wrap.appendChild(pill);
    });
    callback(active);
}

function invLine(name, data, color, style) {
    return { name, type:'line', smooth:true, data,
        lineStyle:{ color, width:2, type: style||'solid' },
        itemStyle:{ color }, symbol:'none', emphasis:{ focus:'series' } };
}

function invSetChart1(sel) {
    const el = document.getElementById('inv-chart-1');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ trigger:'axis' },
        legend:{ show:false },
        grid:{ top:8, bottom:32, left:48, right:16 },
        xAxis:{ type:'category', data:INV_MONTHS, axisLabel:{ fontSize:11 }, axisLine:{ lineStyle:{ color:'#ddd' } } },
        yAxis:{ type:'value', name:'天', nameTextStyle:{ fontSize:10 }, axisLabel:{ fontSize:11 }, splitLine:{ lineStyle:{ color:'#f0f0f0' } },
            max: v => Math.ceil(v.max * 1.15),
            markLine:{ data:[{ yAxis:45, name:'警戒线', lineStyle:{ color:'#EF4444', type:'dashed', width:1.5 }, label:{ formatter:'警戒45天', color:'#EF4444', fontSize:10 } }] } },
        series: sel.map(b => invLine(b, INV_DAYS[b]||[], invColor(b)))
    }, true);
}

function invSetChart2(sel) {
    const el = document.getElementById('inv-chart-2');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ trigger:'axis', formatter: params => {
            const lines = params.map(p => `<span style="color:${p.color}">●</span> ${p.seriesName}: ${p.value}`);
            return params[0].name + '<br>' + lines.join('<br>');
        }},
        legend:{ show:false },
        grid:{ top:8, bottom:32, left:42, right:16 },
        xAxis:{ type:'category', data:INV_MONTHS, axisLabel:{ fontSize:11 }, axisLine:{ lineStyle:{ color:'#ddd' } } },
        yAxis:{ type:'value', name:'系数', nameTextStyle:{ fontSize:10 }, axisLabel:{ fontSize:11 }, splitLine:{ lineStyle:{ color:'#f0f0f0' } },
            min:0, max: v => Math.ceil(v.max * 1.1 * 10) / 10 },
        series: [
            { type:'line', data: INV_MONTHS.map(() => 1.5), name:'警戒线',
              lineStyle:{ color:'#EF4444', type:'dashed', width:1.5 }, symbol:'none',
              itemStyle:{ color:'#EF4444' }, tooltip:{ show:false } },
            ...sel.map(b => invLine(b, INV_COEF[b]||[], invColor(b)))
        ]
    }, true);
}

function invSetChart3(sel) {
    const el = document.getElementById('inv-chart-3');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ trigger:'axis' },
        legend:{ show:false },
        grid:{ top:8, bottom:32, left:48, right:48 },
        xAxis:{ type:'category', data:INV_MONTHS, axisLabel:{ fontSize:11 }, axisLine:{ lineStyle:{ color:'#ddd' } } },
        yAxis:[
            { type:'value', name:'产销率%', nameTextStyle:{ fontSize:10 }, axisLabel:{ fontSize:11 }, splitLine:{ lineStyle:{ color:'#f0f0f0' } }, min:65, max:110 },
            { type:'value', name:'产销率%', show:false }
        ],
        series: sel.map(b => ({ name:b, type:'line', smooth:true, data: INV_PSR[b]||[],
            lineStyle:{ color:invColor(b), width:2 }, itemStyle:{ color:invColor(b) }, symbol:'none', emphasis:{ focus:'series' } }))
    }, true);
}

function initInvPanels() {
    if (document.getElementById('inv-chart-1').dataset.init) return;
    document.getElementById('inv-chart-1').dataset.init = '1';
    invMakeSelector('inv1-brands', invSetChart1);
    invMakeSelector('inv2-brands', invSetChart2);
    invMakeSelector('inv3-brands', invSetChart3);
}

// ============================================================
// 竞争力分析 Charts
// ============================================================
const CMP_BRANDS = ['比亚迪','吉利汽车','广汽集团','长安汽车','上汽集团','特斯拉','理想汽车','蔚来','小鹏汽车','零跑汽车','华为问界','小米汽车','奇瑞汽车','长城汽车','哪吒汽车'];
const CMP_DEFAULT_SHARE = ['比亚迪','理想汽车','华为问界','特斯拉','上汽集团'];
const CMP_DEFAULT_RADAR = ['比亚迪','理想汽车','华为问界'];
const CMP_MONTHS = ['3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月'];

// 市场份额 %
const CMP_SHARE = {
    '比亚迪':   [28.1,28.5,29.0,29.5,30.0,30.5,30.1,30.5,30.8,30.1,30.5,31.0],
    '吉利汽车': [8.5,8.3,8.4,8.2,8.1,7.9,8.0,8.2,8.3,8.4,8.5,8.6],
    '广汽集团': [7.2,7.0,6.8,6.5,6.2,6.0,5.8,5.9,6.0,5.8,5.7,5.6],
    '长安汽车': [5.8,5.6,5.5,5.4,5.2,5.0,5.1,5.2,5.3,5.4,5.5,5.5],
    '上汽集团': [10.2,10.0,9.8,9.5,9.2,8.9,8.8,8.9,9.0,8.9,8.8,8.7],
    '特斯拉':   [5.5,5.3,5.2,5.0,4.8,4.6,4.7,4.8,4.9,4.6,4.7,4.8],
    '理想汽车': [6.8,7.0,7.2,7.5,7.8,8.0,7.8,7.9,8.0,7.4,7.5,7.6],
    '蔚来':     [2.8,2.7,2.6,2.5,2.4,2.3,2.4,2.5,2.5,2.0,2.1,2.2],
    '小鹏汽车': [2.2,2.3,2.4,2.5,2.6,2.8,2.7,2.6,2.7,2.6,2.6,2.7],
    '零跑汽车': [2.5,2.6,2.7,2.8,2.9,3.0,3.1,3.2,3.3,3.2,3.3,3.4],
    '华为问界': [3.8,4.0,4.2,4.3,4.5,4.6,4.5,4.6,4.7,4.1,4.2,4.3],
    '小米汽车': [0.8,1.0,1.2,1.4,1.5,1.6,1.7,1.8,1.9,2.0,2.1,2.2],
    '奇瑞汽车': [4.8,4.9,5.0,5.1,5.2,5.3,5.4,5.5,5.6,5.6,5.7,5.8],
    '长城汽车': [4.2,4.1,4.0,3.9,3.8,3.7,3.6,3.7,3.8,3.8,3.9,4.0],
    '哪吒汽车': [1.5,1.4,1.3,1.2,1.1,1.0,0.9,0.8,0.7,0.7,0.6,0.6],
};

// 智驾能力评分 [自动泊车,高速领航,城市领航,紧急制动,车道保持,视觉感知]
const CMP_RADAR = {
    '比亚迪':   [82,78,70,85,88,80],
    '吉利汽车': [72,68,60,78,80,72],
    '广汽集团': [65,62,55,70,75,68],
    '长安汽车': [70,68,62,74,78,72],
    '上汽集团': [68,65,58,72,76,70],
    '特斯拉':   [95,92,90,95,98,95],
    '理想汽车': [88,85,82,90,92,88],
    '蔚来':     [85,82,78,88,90,85],
    '小鹏汽车': [90,88,85,92,94,90],
    '零跑汽车': [70,68,62,75,78,72],
    '华为问界': [92,90,88,93,95,92],
    '小米汽车': [85,82,80,88,90,86],
    '奇瑞汽车': [68,65,60,72,76,70],
    '长城汽车': [75,72,68,78,80,74],
    '哪吒汽车': [58,55,50,62,65,60],
};

// 价格带与毛利率矩阵 [avg price (万), gross margin %, monthly sales (万辆), category]
const CMP_MATRIX = [
    {name:'比亚迪',   price:15.5, margin:22.5, sales:47.46, cat:'自主'},
    {name:'吉利汽车', price:16.8, margin:16.2, sales:22.8,  cat:'自主'},
    {name:'广汽集团', price:15.2, margin:13.8, sales:17.5,  cat:'自主'},
    {name:'长安汽车', price:14.8, margin:14.5, sales:16.2,  cat:'自主'},
    {name:'上汽集团', price:13.5, margin:11.2, sales:22.4,  cat:'自主'},
    {name:'特斯拉',   price:28.5, margin:18.5, sales:18.8,  cat:'外资'},
    {name:'理想汽车', price:38.5, margin:21.5, sales:28.5,  cat:'新势力'},
    {name:'蔚来',     price:42.0, margin:9.5,  sales:8.2,   cat:'新势力'},
    {name:'小鹏汽车', price:18.5, margin:8.5,  sales:10.2,  cat:'新势力'},
    {name:'零跑汽车', price:12.5, margin:11.8, sales:8.5,   cat:'新势力'},
    {name:'华为问界', price:35.0, margin:20.2, sales:16.2,  cat:'新势力'},
    {name:'小米汽车', price:24.5, margin:12.5, sales:12.8,  cat:'新势力'},
    {name:'奇瑞汽车', price:12.8, margin:15.8, sales:16.5,  cat:'自主'},
    {name:'长城汽车', price:18.5, margin:17.2, sales:14.8,  cat:'自主'},
    {name:'哪吒汽车', price:11.5, margin:2.5,  sales:4.5,   cat:'新势力'},
];
const CMP_CAT_COLOR = { '自主':'#3B82F6', '外资':'#F97316', '新势力':'#8B5CF6' };

function cmpColor(b) { return SP_COLORS[CMP_BRANDS.indexOf(b)] || SP_COLORS[SP_BRANDS.indexOf(b)] || '#888'; }

function cmpMakeShareSelector(containerId, callback) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    let active = CMP_DEFAULT_SHARE.slice();
    CMP_BRANDS.forEach(b => {
        const pill = document.createElement('span');
        pill.className = 'cmp-brand-pill' + (active.includes(b) ? ' active' : '');
        pill.textContent = b;
        const c = cmpColor(b);
        if (active.includes(b)) pill.style.cssText = `background:${c};border-color:${c}`;
        pill.addEventListener('click', () => {
            if (pill.classList.contains('active')) {
                if (active.length <= 1) return;
                active = active.filter(x => x !== b);
                pill.classList.remove('active');
                pill.style.cssText = '';
            } else {
                if (active.length >= 7) return;
                active.push(b);
                pill.classList.add('active');
                pill.style.cssText = `background:${c};border-color:${c}`;
            }
            callback(active);
        });
        wrap.appendChild(pill);
    });
    callback(active);
}

function cmpMakeRadarSelector(containerId, callback) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    let active = CMP_DEFAULT_RADAR.slice();
    CMP_BRANDS.forEach(b => {
        const pill = document.createElement('span');
        pill.className = 'cmp-brand-pill' + (active.includes(b) ? ' active' : '');
        pill.textContent = b;
        const c = cmpColor(b);
        if (active.includes(b)) pill.style.cssText = `background:${c};border-color:${c}`;
        pill.addEventListener('click', () => {
            if (pill.classList.contains('active')) {
                if (active.length <= 1) return;
                active = active.filter(x => x !== b);
                pill.classList.remove('active');
                pill.style.cssText = '';
            } else {
                if (active.length >= 4) return;
                active.push(b);
                pill.classList.add('active');
                pill.style.cssText = `background:${c};border-color:${c}`;
            }
            callback(active);
        });
        wrap.appendChild(pill);
    });
    callback(active);
}

function cmpSetChart1(sel) {
    const el = document.getElementById('cmp-chart-1');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ trigger:'axis', formatter: params => {
            const lines = params.map(p => `<span style="color:${p.color}">●</span> ${p.seriesName}: ${p.value}%`);
            return params[0].name + '<br>' + lines.join('<br>');
        }},
        legend:{ show:false },
        grid:{ top:8, bottom:32, left:42, right:16 },
        xAxis:{ type:'category', data:CMP_MONTHS, axisLabel:{ fontSize:11 }, axisLine:{ lineStyle:{ color:'#ddd' } } },
        yAxis:{ type:'value', name:'份额%', nameTextStyle:{ fontSize:10 }, axisLabel:{ formatter:'{value}%', fontSize:11 }, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
        series: sel.map(b => ({
            name:b, type:'line', smooth:true, data: CMP_SHARE[b]||[],
            lineStyle:{ color:cmpColor(b), width:2 }, itemStyle:{ color:cmpColor(b) },
            symbol:'none', emphasis:{ focus:'series' },
            areaStyle:{ color:{ type:'linear', x:0,y:0,x2:0,y2:1, colorStops:[{offset:0, color:cmpColor(b)+'40'},{offset:1, color:cmpColor(b)+'05'}] } }
        }))
    }, true);
}

function cmpSetChart2(sel) {
    const el = document.getElementById('cmp-chart-2');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    const dims = ['自动泊车','高速领航','城市领航','紧急制动','车道保持','视觉感知'];
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ trigger:'item' },
        radar:{ indicator: dims.map(d => ({ name:d, max:100 })), radius:'70%', center:['50%','52%'],
            axisName:{ fontSize:10, color:'#666' },
            splitLine:{ lineStyle:{ color:'#e8ecf0' } },
            splitArea:{ areaStyle:{ color:['rgba(245,247,250,0.5)','transparent'] } } },
        series:[{ type:'radar', data: sel.map(b => ({
            name:b, value: CMP_RADAR[b]||[],
            lineStyle:{ color:cmpColor(b), width:2 },
            areaStyle:{ color:cmpColor(b)+'30' },
            itemStyle:{ color:cmpColor(b) }
        }))}]
    }, true);
}

function cmpSetChart3() {
    const el = document.getElementById('cmp-chart-3');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    const cats = ['自主','外资','新势力'];
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ formatter: p => {
            const d = CMP_MATRIX[p.dataIndex];
            return `${d.name}<br>均价: ${d.price}万元<br>毛利率: ${d.margin}%<br>月销: ${d.sales}万辆`;
        }},
        legend:{ data:cats, bottom:0, textStyle:{ fontSize:11 } },
        grid:{ top:8, bottom:40, left:48, right:16 },
        xAxis:{ type:'value', name:'均价(万元)', nameTextStyle:{ fontSize:10 }, axisLabel:{ fontSize:11 }, min:8, max:48, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
        yAxis:{ type:'value', name:'毛利率%', nameTextStyle:{ fontSize:10 }, axisLabel:{ formatter:'{value}%', fontSize:11 }, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
        series: cats.map(cat => ({
            name:cat, type:'scatter', symbolSize: d => Math.max(10, Math.sqrt(d[2]) * 9),
            itemStyle:{ color: CMP_CAT_COLOR[cat], opacity:0.75 },
            label:{ show:true, formatter: p => CMP_MATRIX[p.dataIndex].name, fontSize:9, color:'#333', position:'top' },
            data: CMP_MATRIX.filter(d => d.cat === cat).map(d => [d.price, d.margin, d.sales])
        }))
    }, true);
}

function initCmpPanels() {
    if (document.getElementById('cmp-chart-1').dataset.init) return;
    document.getElementById('cmp-chart-1').dataset.init = '1';
    cmpMakeShareSelector('cmp1-brands', cmpSetChart1);
    cmpMakeRadarSelector('cmp2-brands', cmpSetChart2);
    cmpSetChart3();
}

// ============================================================
// 产业链分析 Charts
// ============================================================
const CHAIN_SEGS = ['锂矿开采','碳酸锂','正极材料','负极材料','电芯制造','动力电池','整车制造','智能驾驶','热管理','经销商'];
const CHAIN_COLORS = ['#4B85E6','#F97316','#22C55E','#9333EA','#06B6D4','#EF4444','#84CC16','#F59E0B','#8B5CF6','#EC4899'];
const CHAIN_DEFAULT = ['锂矿开采','动力电池','整车制造','经销商'];
const CHAIN_MONTHS = ['3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月'];

// 毛利率 % (逐步下行叙事：上游资源/智驾高，中游电池中等，整车/经销商低)
const CHAIN_GM = {
    '锂矿开采':  [52,48,42,36,31,28,24,20,18,18,17,16],
    '碳酸锂':    [48,44,38,32,27,24,21,18,16,16,15,14],
    '正极材料':  [24,22,20,18,16,15,14,13,12,12,12,11],
    '负极材料':  [28,26,24,22,20,19,18,17,16,15,15,14],
    '电芯制造':  [20,19,18,17,16,15,14,14,13,13,13,12],
    '动力电池':  [22,22,21,21,20,20,19,19,19,19,18,18],
    '整车制造':  [16,16,15,14,14,13,13,12,12,12,12,12],
    '智能驾驶':  [42,42,41,40,40,39,38,38,37,37,36,35],
    '热管理':    [32,31,30,29,28,27,26,25,24,24,23,22],
    '经销商':    [5,5,4,4,3,3,3,2,2,2,2,2],
};

// 产能利用率排行（降序排列供横向bar）
const CHAIN_CAP_DATA = [
    { name:'智能驾驶', val:88 },
    { name:'热管理',   val:75 },
    { name:'整车制造', val:68 },
    { name:'动力电池', val:61 },
    { name:'锂矿开采', val:58 },
    { name:'负极材料', val:56 },
    { name:'正极材料', val:55 },
    { name:'碳酸锂',   val:52 },
    { name:'电芯制造', val:49 },
    { name:'经销商',   val:42 },
];

// 利润池分布（全产业链利润占比）
const CHAIN_PROFIT_POOL = [
    { name:'上游矿产',  value:42, itemStyle:{ color:'#4B85E6' } },
    { name:'化学材料',  value:22, itemStyle:{ color:'#F97316' } },
    { name:'电池系统',  value:18, itemStyle:{ color:'#22C55E' } },
    { name:'整车制造',  value:11, itemStyle:{ color:'#9333EA' } },
    { name:'经销服务',  value:7,  itemStyle:{ color:'#06B6D4' } },
];

function chainColor(s) { return CHAIN_COLORS[CHAIN_SEGS.indexOf(s)] || '#888'; }

function chainMakeSelector(containerId, callback) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    let active = CHAIN_DEFAULT.slice();
    CHAIN_SEGS.forEach(s => {
        const pill = document.createElement('span');
        pill.className = 'chain-seg-pill' + (active.includes(s) ? ' active' : '');
        pill.textContent = s;
        const c = chainColor(s);
        if (active.includes(s)) pill.style.cssText = `background:${c};border-color:${c}`;
        pill.addEventListener('click', () => {
            if (pill.classList.contains('active')) {
                if (active.length <= 1) return;
                active = active.filter(x => x !== s);
                pill.classList.remove('active');
                pill.style.cssText = '';
            } else {
                if (active.length >= 6) return;
                active.push(s);
                pill.classList.add('active');
                pill.style.cssText = `background:${c};border-color:${c}`;
            }
            callback(active);
        });
        wrap.appendChild(pill);
    });
    callback(active);
}

function chainSetChart1(sel) {
    const el = document.getElementById('chain-chart-1');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ trigger:'axis', formatter: params => {
            const lines = params.map(p => `<span style="color:${p.color}">●</span> ${p.seriesName}: ${p.value}%`);
            return params[0].name + '<br>' + lines.join('<br>');
        }},
        legend:{ show:false },
        grid:{ top:8, bottom:32, left:42, right:16 },
        xAxis:{ type:'category', data:CHAIN_MONTHS, axisLabel:{ fontSize:11 }, axisLine:{ lineStyle:{ color:'#ddd' } } },
        yAxis:{ type:'value', name:'毛利率%', nameTextStyle:{ fontSize:10 }, axisLabel:{ formatter:'{value}%', fontSize:11 }, splitLine:{ lineStyle:{ color:'#f0f0f0' } }, min:0 },
        series: sel.map(s => ({
            name:s, type:'line', smooth:true, data: CHAIN_GM[s]||[],
            lineStyle:{ color:chainColor(s), width:2 }, itemStyle:{ color:chainColor(s) },
            symbol:'none', emphasis:{ focus:'series' }
        }))
    }, true);
}

function chainSetChart2() {
    const el = document.getElementById('chain-chart-2');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ formatter: p => `${p.name}: ${p.value}%` },
        grid:{ top:8, bottom:8, left:72, right:44 },
        xAxis:{ type:'value', max:100, axisLabel:{ formatter:'{value}%', fontSize:10 }, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
        yAxis:{ type:'category', data: CHAIN_CAP_DATA.map(d => d.name), axisLabel:{ fontSize:11 } },
        series:[{
            type:'bar', barWidth:12,
            data: CHAIN_CAP_DATA.map(d => ({
                value:d.val,
                itemStyle:{ color: d.val>=80 ? '#22C55E' : d.val>=65 ? '#F59E0B' : '#EF4444', borderRadius:[0,4,4,0] }
            })),
            markLine:{ silent:true, data:[{ xAxis:65, lineStyle:{ color:'#F59E0B', type:'dashed', width:1.5 },
                label:{ formatter:'健康线65%', fontSize:10, color:'#F59E0B' } }] }
        }]
    }, true);
}

function chainSetChart3() {
    const el = document.getElementById('chain-chart-3');
    if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        backgroundColor:'transparent',
        tooltip:{ formatter: p => `${p.name}: ${p.value}%` },
        legend:{ show:false },
        series:[{
            type:'pie', radius:['42%','70%'], center:['50%','50%'],
            data: CHAIN_PROFIT_POOL,
            label:{ formatter:'{b}\n{d}%', fontSize:10, lineHeight:14 },
            emphasis:{ itemStyle:{ shadowBlur:8, shadowColor:'rgba(0,0,0,0.15)' } }
        }]
    }, true);
}

function initChainCharts() {
    const el = document.getElementById('chain-chart-1');
    if (!el || el.dataset.init) return;
    el.dataset.init = '1';
    chainMakeSelector('chain1-segs', chainSetChart1);
    chainSetChart2();
    chainSetChart3();
}
