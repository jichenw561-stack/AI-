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
