// hot_tracks.js - Scripts for the Hot Tracks page

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function () {
    initCharts();
    initFeatureTabs();
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

function _htProcessCard(title, id, delay) {
    _htAt(delay, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-process-card'; el.id = id;
        el.innerHTML = `<div class="ht-process-header"><i class="fa-solid fa-bolt"></i> ${title}</div><div id="${id}_s"></div>`;
        msgs.appendChild(el); _htScroll();
    });
}

function _htStep(cardId, stepId, name, sub, delay) {
    _htAt(delay, () => {
        const c = document.getElementById(cardId + '_s');
        if (!c) return;
        const el = document.createElement('div');
        el.className = 'ht-process-step';
        el.innerHTML = `<span class="ht-step-icon spin" id="${stepId}"><i class="fa-solid fa-circle-notch fa-spin"></i></span><span class="ht-step-content"><span class="ht-step-name">${name}</span><span class="ht-step-sub">${sub}</span></span>`;
        c.appendChild(el); _htScroll();
    });
}
function _htDone(stepId, delay) {
    _htAt(delay, () => {
        const ic = document.getElementById(stepId);
        if (ic) { ic.innerHTML = '<i class="fa-solid fa-circle-check"></i>'; ic.className = 'ht-step-icon done'; }
    });
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
    // restore toolbar default
    document.querySelectorAll('.ht-ai-tool').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });
}

// ── Demo 1: 因子分析 ──────────────────────────────────────────────────
function _htDemo1() {
    let t = 300;

    _htUserMsg('新能源车企目前上险量维度的渠道库存压力趋势是怎么样的', t); t += 700;
    _htShowTyping(t); t += 900; _htHideTyping(t);

    _htProcessCard('调用因子 SKILL · 上险量-累库分析', 'D1', t); t += 300;

    const steps1 = [
        ['D1s1', '步骤 1 &nbsp;原始数据获取', '上险量 · 产量 · 出口量 · 零售销量（8 家主要车企 · 近 12 个月）'],
        ['D1s2', '步骤 2 &nbsp;因子加工', '累库量 = 产量 − 出口量 − 上险量 &nbsp;|&nbsp; 累库深度 = 累库量 ÷ 近 90 日均零售'],
        ['D1s3', '步骤 3 &nbsp;可视化', '生成近 12 个月累库量柱状图 + 累库深度折线图'],
        ['D1s4', '步骤 4 &nbsp;分析概括', '异动检测 · 趋势解读 · 推荐关注指标'],
    ];
    steps1.forEach(([sid, name, sub]) => {
        _htStep('D1', sid, name, sub, t); t += 550;
        _htDone(sid, t); t += 150;
    });

    // Chart
    _htAt(t, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const w = document.createElement('div');
        w.className = 'ht-chart-wrap';
        w.innerHTML = `<div class="ht-chart-title">比亚迪 · 渠道累库趋势（2025年）</div>${_htChartSVG()}<div class="ht-chart-legend"><span class="ht-legend-bar">累库量（万辆）</span><span class="ht-legend-line">累库深度（%）</span></div>`;
        msgs.appendChild(w); _htScroll();
    }); t += 700;

    // Stat chips
    _htAt(t, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-stat-row';
        el.innerHTML = `
          <div class="ht-stat-chip"><span class="val">13.77</span><span class="unit">万辆 · 累库量</span><div class="delta delta-down"><i class="fa-solid fa-caret-down"></i> −4.39万 MoM</div></div>
          <div class="ht-stat-chip"><span class="val">−30%</span><span class="unit">累库深度 MoM</span><div class="delta delta-down"><i class="fa-solid fa-caret-down"></i> 趋势向好</div></div>`;
        msgs.appendChild(el); _htScroll();
    }); t += 500;

    // Report
    _htAt(t, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-report-card';
        el.innerHTML = `
          <div class="ht-report-title"><i class="fa-solid fa-file-lines" style="color:#4B85E6"></i> 渠道库存压力简报</div>
          <div class="ht-report-meta">截至 2025年12月 · 覆盖 8 家主要新能源车企</div>
          <div class="ht-report-section">
            <div class="ht-report-section-title">⚠ 异动指标</div>
            <div class="ht-report-item"><i class="fa-solid fa-circle-exclamation" style="color:#F59E0B"></i><span><strong>比亚迪</strong> 累库量 13.77 万辆，较上月减少 4.39 万辆；累库深度下降 30%，绝对值仍偏高，需持续跟踪</span></div>
            <div class="ht-report-item"><i class="fa-solid fa-circle-dot" style="color:#C0C8D8"></i><span>行业总累库量约 62.4 万辆，环比下降 7.2%；7 家车企深度改善，1 家（理想）小幅上升</span></div>
          </div>
          <div class="ht-report-section">
            <div class="ht-report-section-title">☆ 推荐关注指标</div>
            <div class="ht-report-item"><i class="fa-solid fa-star" style="color:#4B85E6"></i><span>终端销量（上险量）— 最直接的真实需求信号</span></div>
            <div class="ht-report-item"><i class="fa-solid fa-star" style="color:#4B85E6"></i><span>车企门店数量 — 渠道扩张速度与压库关联</span></div>
            <div class="ht-report-item"><i class="fa-solid fa-star" style="color:#4B85E6"></i><span>零公里二手车挂牌量 — 渠道压力的领先指标</span></div>
          </div>`;
        msgs.appendChild(el); _htScroll();
    });
}

function _htChartSVG() {
    const vw = 320, vh = 140, pL = 32, pR = 8, pT = 10, pB = 24;
    const cW = vw - pL - pR, cH = vh - pT - pB, n = 12;
    const vol = [16.8,13.2,19.5,15.4,12.6,17.2,20.1,18.3,15.8,17.4,18.16,13.77];
    const dep = [42,35,48,39,32,43,51,46,40,44,52,36];
    const maxV = 22, maxD = 60, slot = cW / n, bw = slot * 0.55;
    let bars = '', pts = '', xlbl = '';
    for (let i = 0; i < n; i++) {
        const bx = pL + i * slot + (slot - bw) / 2;
        const bh = (vol[i] / maxV) * cH;
        const by = pT + cH - bh;
        bars += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${i===11?'#4B85E6':'#BFCFE9'}"/>`;
        const lx = pL + i * slot + slot / 2, ly = pT + cH - (dep[i] / maxD) * cH;
        pts += `${lx.toFixed(1)},${ly.toFixed(1)} `;
        if (i % 3 === 0 || i === 11)
            xlbl += `<text x="${(pL+i*slot+slot/2).toFixed(1)}" y="${vh-3}" text-anchor="middle" font-size="8.5" fill="#B0B8C8">${i+1}月</text>`;
    }
    const yLines = [0,10,20].map(v => {
        const y = (pT + cH - (v/maxV)*cH).toFixed(1);
        return `<text x="${pL-3}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="8" fill="#C0C8D8">${v}</text><line x1="${pL}" y1="${y}" x2="${pL+cW}" y2="${y}" stroke="#F0F2F5" stroke-width="1"/>`;
    }).join('');
    const lbx = (pL + 11*slot + slot/2).toFixed(1);
    const lby = (pT + cH - (vol[11]/maxV)*cH - 5).toFixed(1);
    return `<svg viewBox="0 0 ${vw} ${vh}" width="100%">${yLines}${bars}<polyline points="${pts.trim()}" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>${xlbl}<text x="${lbx}" y="${lby}" text-anchor="middle" font-size="8.5" fill="#2D68FF" font-weight="bold">13.77</text></svg>`;
}

// ── Demo 2: 创建技能 ──────────────────────────────────────────────────
function _htDemo2() {
    let t = 300;

    // Highlight toolbar
    _htAt(t, () => {
        document.querySelectorAll('.ht-ai-tool').forEach(b => {
            b.classList.toggle('active', b.textContent.includes('创建技能'));
        });
    }); t += 600;

    _htUserMsg('帮我生成一个新能源汽车行业销售潜力分析技能', t); t += 700;
    _htShowTyping(t); t += 1000; _htHideTyping(t);

    _htProcessCard('调用 skill-create · 技能生成器', 'D2A', t); t += 300;
    _htStep('D2A','D2As1','解析需求','新能源汽车 · 销售潜力 · 行业分析', t); t+=550; _htDone('D2As1',t); t+=150;
    _htStep('D2A','D2As2','生成技能框架','规划分析模块 · 配置数据源 · 生成执行逻辑', t); t+=700; _htDone('D2As2',t); t+=150;
    _htStep('D2A','D2As3','等待用户确认','请确认技能配置后执行', t); t+=200;

    // Skill draft card
    _htAt(t, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-skill-card';
        el.innerHTML = `
          <div class="ht-skill-card-title"><i class="fa-solid fa-puzzle-piece"></i> 新技能草稿</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">1</span> 终端销量趋势分析</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">2</span> 渠道库存水位评估</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">3</span> 价格带分布与竞争分析</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">4</span> 下沉市场渗透率追踪</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">5</span> 竞品销量对比</div>
          <div class="ht-skill-actions">
            <button class="ht-skill-confirm-btn"><i class="fa-solid fa-check"></i> 确认执行</button>
            <button class="ht-skill-modify-btn"><i class="fa-solid fa-pen"></i> 修改</button>
          </div>`;
        msgs.appendChild(el); _htScroll();
    }); t += 1800;

    // Auto confirm
    _htAt(t, () => { const ic = document.getElementById('D2As3'); if(ic){ic.innerHTML='<i class="fa-solid fa-circle-check"></i>';ic.className='ht-step-icon done';} });
    _htUserMsg('确认执行', t); t += 600;
    _htShowTyping(t); t += 700; _htHideTyping(t);

    // Execute skill
    _htProcessCard('执行技能 · 新能源销售潜力分析 v1', 'D2B', t); t += 300;
    const exec = [
        ['D2Bs1','模块 1 &nbsp;终端销量趋势分析','加载上险量 · 批发量 · 终端交付数据'],
        ['D2Bs2','模块 2 &nbsp;渠道库存水位评估','计算各车企渠道库存深度及压库风险系数'],
        ['D2Bs3','模块 3 &nbsp;价格带分布分析','15-20万 / 20-30万 / 30万+ 各档竞争格局'],
        ['D2Bs4','模块 4 &nbsp;下沉市场渗透追踪','三四线城市上险量同比增速与渗透率变化'],
        ['D2Bs5','模块 5 &nbsp;竞品销量对比','比亚迪 / 特斯拉 / 理想 / 小米 市场份额'],
    ];
    exec.forEach(([sid,name,sub]) => { _htStep('D2B',sid,name,sub,t); t+=480; _htDone(sid,t); t+=120; });
    t += 300;

    // Result v1
    _htAt(t, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-report-card';
        el.innerHTML = `
          <div class="ht-report-title"><i class="fa-solid fa-chart-line" style="color:#10B981"></i> 销售潜力分析简报 · v1</div>
          <div class="ht-report-meta">已完成 5 个模块 · 数据截至 2025年12月</div>
          <div class="ht-report-item"><i class="fa-solid fa-circle-check" style="color:#10B981"></i><span>全年终端累计增速 28.4%，12 月环比回升，旺季拉动明显</span></div>
          <div class="ht-report-item"><i class="fa-solid fa-circle-exclamation" style="color:#F59E0B"></i><span>20-30 万档竞争最激烈，理想 / 问界 / 小米三方厮杀；30万+ 特斯拉份额持续下滑</span></div>
          <div class="ht-report-item"><i class="fa-solid fa-circle-check" style="color:#10B981"></i><span>三四线城市新增上险量占比由 21% 升至 29%，下沉市场潜力显著</span></div>`;
        msgs.appendChild(el); _htScroll();
    }); t += 1200;

    // User unsatisfied
    _htUserMsg('分析还不够全面，请增加「区域渗透率热力图」分析模块', t); t += 700;
    _htShowTyping(t); t += 900; _htHideTyping(t);

    // Updated skill card
    _htAt(t, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-skill-card';
        el.innerHTML = `
          <div class="ht-skill-card-title"><i class="fa-solid fa-rotate"></i> 技能已更新（+1 模块）</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">1</span> 终端销量趋势分析</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">2</span> 渠道库存水位评估</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">3</span> 价格带分布与竞争分析</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">4</span> 下沉市场渗透率追踪</div>
          <div class="ht-skill-module"><span class="ht-skill-module-num">5</span> 竞品销量对比</div>
          <div class="ht-skill-module ht-new-mod"><span class="ht-skill-module-num">6</span> ✦ 区域渗透率热力图（新增）</div>`;
        msgs.appendChild(el); _htScroll();
    }); t += 600;

    // Re-run
    _htProcessCard('重新执行 · 新能源销售潜力分析 v2', 'D2C', t); t += 300;
    const rerun = [
        ['D2Cs1','模块 1-5 &nbsp;复用上次结果','数据未变，跳过重算，直接加载缓存'],
        ['D2Cs2','模块 6 &nbsp;区域渗透率热力图','按省份加载上险量 · 计算渗透率 · 生成热力分布'],
    ];
    rerun.forEach(([sid,name,sub]) => { _htStep('D2C',sid,name,sub,t); t+=600; _htDone(sid,t); t+=150; });
    t += 400;

    // Final result v2
    _htAt(t, () => {
        const msgs = document.getElementById('htAiMessages');
        if (!msgs) return;
        const el = document.createElement('div');
        el.className = 'ht-report-card';
        el.innerHTML = `
          <div class="ht-report-title"><i class="fa-solid fa-chart-line" style="color:#10B981"></i> 销售潜力分析简报 · v2</div>
          <div class="ht-report-meta">已完成 6 个模块 · 含区域热力图 · 数据截至 2025年12月</div>
          <div class="ht-report-item"><i class="fa-solid fa-circle-check" style="color:#10B981"></i><span>华东 / 华南渗透率领先（35%-42%），西部省份仍低于 15%，区域分化显著</span></div>
          <div class="ht-report-item"><i class="fa-solid fa-star" style="color:#4B85E6"></i><span>新疆、甘肃、内蒙古渗透率同比增速最快（+12 ppt），是下一阶段重点布局区域</span></div>
          <div class="ht-report-item" style="color:#059669; font-weight:500;"><i class="fa-solid fa-circle-check" style="color:#059669"></i><span>技能「新能源销售潜力分析 v2」已保存至技能库，可随时复用</span></div>`;
        msgs.appendChild(el); _htScroll();
    });
}
