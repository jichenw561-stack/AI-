// hot_tracks.js - Scripts for the Hot Tracks page

document.addEventListener('DOMContentLoaded', function () {
    initCharts();
    initFeatureTabs();
    initToolbarTabs();

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.qa-dropdown-wrap')) {
            document.querySelectorAll('.qa-dropdown').forEach(m => m.classList.remove('open'));
        }
    });
});

// ---------- Toolbar Tab Switching (金融问答 / 深度研究 / 事实核查) ---------- //
function initToolbarTabs() {
    const tools = document.querySelectorAll('.qa-tool[id^="tool"]');
    tools.forEach(btn => {
        btn.addEventListener('click', () => {
            tools.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// ---------- Suggestion Chips ---------- //
function fillSuggestion(btn) {
    const text = btn.querySelector('span').textContent.trim();
    const input = document.getElementById('qa-input-field');
    input.value = text;
    input.focus();
}

// ---------- QA Dropdown Toggle ---------- //
function toggleQaDropdown(menuId) {
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.qa-dropdown').forEach(m => m.classList.remove('open'));
    if (!isOpen) menu.classList.add('open');
}

// ---------- @Expert Mention ---------- //
function mentionExpert(name) {
    const input = document.getElementById('qa-input-field');
    input.value = `@${name} ` + input.value;
    input.focus();
    document.querySelectorAll('.qa-dropdown').forEach(m => m.classList.remove('open'));
}

// ---------- Smart QA Chat Logic ---------- //
function handleQaKeyPress(e) {
    if (e.key === 'Enter') sendQaMessage();
}

function sendQaMessage() {
    const input = document.getElementById('qa-input-field');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user');
    input.value = '';

    const chatBox = document.getElementById('qa-chat-box');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg msg-agent';
    loadingDiv.innerHTML = `<div class="typing-indicator" style="display:inline-block;margin-top:2px;"><span></span><span></span><span></span></div>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.removeChild(loadingDiv);
        let response = '基于当前特色分析数据，建议您进一步关注 Q3 季报景气度反转信号。如需更详细数据，可运行左侧「竞争格局分析 Agent」。';
        if (msg.includes('复合增长率')) {
            response = '根据赛道增长分析，该赛道 2023-2025 年复合增长率为 <strong>15.2%</strong>，在新能源汽车板块中处于前 10% 水平。';
        } else if (msg.includes('库存') || msg.includes('上险量')) {
            response = '当前全行业广义库存天数已攀升至 <strong>86 天</strong>，突破 75 天安全警戒水位。广汽集团压力最高（58.4 天），建议重点关注其存货跌价计提风险。';
        } else if (msg.includes('北向') || msg.includes('持仓')) {
            response = '近期北向资金持续流入新能源、半导体板块，其中宁德时代、比亚迪获增持明显；消费类个股出现阶段性减持信号，建议持续跟踪。';
        } else if (msg.includes('分析师') || msg.includes('盈利预期')) {
            response = '消费行业卖方分析师近两周盈利预期上修比例达 62%，食品饮料、家电子板块表现突出，市场情绪有所回暖。';
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
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
            setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
        });
    });
}

// ---------- ECharts ---------- //
function initCharts() { /* replaced by custom HTML widgets */ }
window.addEventListener('resize', () => { /* no echarts to resize */ });

// ---------- Data Workshop Navigation ---------- //
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.data-panel .ht-table tbody tr').forEach(row => {
        const btn = row.querySelector('.btn-link');
        if (btn) {
            const name = row.cells[0].innerText.trim();
            btn.addEventListener('click', () => {
                window.location.href = `data_browser.html?indicator=${encodeURIComponent(name)}`;
            });
        }
    });
});

// =============================================================
//  SKILL MANAGEMENT
// =============================================================
const savedSkills = [];
let editingSkillIndex = -1;

function openCreateSkill(index = -1) {
    editingSkillIndex = index;
    const panel   = document.getElementById('skillPanel');
    const overlay = document.getElementById('skillOverlay');
    const title   = document.getElementById('skillPanelTitle');
    const saveBtn = document.getElementById('skillSaveBtn');

    if (index >= 0 && savedSkills[index]) {
        title.innerHTML   = '<i class="fa-solid fa-pen-to-square"></i> 修改技能';
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> 更新技能';
        document.getElementById('skillNameInput').value = savedSkills[index].name;
        document.getElementById('skillDescInput').value = savedSkills[index].desc;
    } else {
        title.innerHTML   = '<i class="fa-solid fa-wand-magic-sparkles"></i> 创建技能';
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> 保存技能';
        document.getElementById('skillNameInput').value = '';
        document.getElementById('skillDescInput').value = '';
    }

    panel.classList.add('open');
    overlay.classList.add('open');
    setTimeout(() => document.getElementById('skillNameInput').focus(), 360);
}

function closeSkillPanel() {
    document.getElementById('skillPanel').classList.remove('open');
    document.getElementById('skillOverlay').classList.remove('open');
    editingSkillIndex = -1;
}

function saveSkill() {
    const name = document.getElementById('skillNameInput').value.trim();
    const desc = document.getElementById('skillDescInput').value.trim();

    if (!name) {
        const inp = document.getElementById('skillNameInput');
        inp.style.borderColor = '#FF4D4F';
        inp.focus();
        setTimeout(() => { inp.style.borderColor = ''; }, 1600);
        return;
    }

    if (editingSkillIndex >= 0) {
        savedSkills[editingSkillIndex] = { name, desc };
        showToast('✅ 技能已更新');
    } else {
        savedSkills.push({ name, desc });
        showToast('✅ 技能已创建');
    }

    updateUseSkillMenu();
    closeSkillPanel();
}

function updateUseSkillMenu() {
    const menu = document.getElementById('useSkillMenu');
    if (savedSkills.length === 0) {
        menu.innerHTML = '<div class="qa-dropdown-empty">暂无技能，请先创建</div>';
        return;
    }
    menu.innerHTML = savedSkills.map((skill, i) => `
        <div class="qa-dropdown-item" onclick="useSkill(${i})">
            <i class="fa-solid fa-wand-magic-sparkles" style="color:#4B85E6;font-size:11px;flex-shrink:0;"></i>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${skill.name}</span>
            <div class="skill-item-actions">
                <span class="skill-action-btn" title="编辑"
                    onclick="event.stopPropagation();openCreateSkill(${i})">
                    <i class="fa-solid fa-pen"></i>
                </span>
                <span class="skill-action-btn" title="删除"
                    onclick="event.stopPropagation();deleteSkill(${i})">
                    <i class="fa-solid fa-trash"></i>
                </span>
            </div>
        </div>
    `).join('');
}

function deleteSkill(index) {
    savedSkills.splice(index, 1);
    updateUseSkillMenu();
    showToast('🗑️ 技能已删除');
}

function useSkill(index) {
    const skill = savedSkills[index];
    document.querySelectorAll('.qa-dropdown').forEach(m => m.classList.remove('open'));

    // Skill-run pill
    const chatBox = document.getElementById('qa-chat-box');
    const pill = document.createElement('div');
    pill.className = 'msg-skill-run';
    pill.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> 运行技能：${skill.name}`;
    chatBox.appendChild(pill);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Typing indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg msg-agent';
    loadingDiv.innerHTML = `<div class="typing-indicator" style="display:inline-block;margin-top:2px;"><span></span><span></span><span></span></div>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.removeChild(loadingDiv);
        const result =
            `正在执行「<strong>${skill.name}</strong>」技能…<br><br>` +
            `<div style="background:#F8FAFD;border:1px solid #DCE6F5;border-radius:6px;padding:12px;font-size:12px;line-height:2;">` +
            `📊 2025-12 终端销量 <strong>71.2 万辆</strong>（同比 +38.6%）<br>` +
            `⚠️ 渠道库存天数 <strong>86 天</strong>，超警戒水位（75 天）<br>` +
            `🚨 广汽集团库存压力最高（周转 58.4 天，环比 +8.1 天）<br>` +
            `✅ 比亚迪 / 理想库存健康，建议持续跟踪` +
            `</div>`;
        appendMessage(result, 'agent');
    }, 2000);
}

function toggleSceneTag(el) {
    el.classList.toggle('active');
}

function showToast(msg) {
    const toast = document.getElementById('skillToast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
}

// =============================================================
//  SKILL DEMO ANIMATION
// =============================================================
function startSkillDemo() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function typeText(input, text, speed = 45) {
        input.value = '';
        input.focus();
        for (let i = 0; i < text.length; i++) {
            input.value += text[i];
            await delay(speed);
        }
    }

    async function run() {
        // Disable the demo button to prevent re-entry
        const demoBtn = document.querySelector('.demo-trigger-btn');
        if (demoBtn) { demoBtn.disabled = true; demoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 演示中…'; }

        appendMessage('好的，我来演示「创建技能 → 使用技能 → 修改技能」的完整流程。', 'agent');
        await delay(1200);

        // ── STEP 1: 创建技能 ──
        appendMessage('第一步：点击「创建技能」按钮', 'agent');
        await delay(600);

        const createBtn = document.getElementById('createSkillBtn');
        createBtn.classList.add('demo-pulse');
        await delay(1400);
        createBtn.classList.remove('demo-pulse');

        openCreateSkill();
        await delay(700);

        const nameInput = document.getElementById('skillNameInput');
        const descInput = document.getElementById('skillDescInput');

        await typeText(nameInput, '新能源日报生成助手', 60);
        await delay(400);
        await typeText(descInput, '每日汇总新能源终端销量与渠道库存数据，结合压力预警指数，自动生成一份结构化行业投资日报。', 28);
        await delay(700);

        document.getElementById('skillSaveBtn').click();
        await delay(900);

        appendMessage('技能「<strong>新能源日报生成助手</strong>」已创建成功！', 'agent');
        await delay(1400);

        // ── STEP 2: 使用技能 ──
        appendMessage('第二步：点击「使用技能」，选择刚创建的技能运行。', 'agent');
        await delay(700);

        const useBtn = document.getElementById('useSkillBtn');
        useBtn.classList.add('demo-pulse');
        await delay(1400);
        useBtn.classList.remove('demo-pulse');

        toggleQaDropdown('useSkillMenu');
        await delay(1000);

        useSkill(0);
        document.getElementById('useSkillMenu').classList.remove('open');
        await delay(3200);

        // ── STEP 3: 修改技能 ──
        appendMessage('第三步：对技能进行修改——在「使用技能」下拉菜单中点击编辑图标。', 'agent');
        await delay(800);

        toggleQaDropdown('useSkillMenu');
        await delay(900);
        document.getElementById('useSkillMenu').classList.remove('open');

        openCreateSkill(0);
        await delay(700);

        const editDesc = document.getElementById('skillDescInput');
        editDesc.value = '';
        await typeText(editDesc,
            '每日汇总新能源终端销量与渠道库存数据，结合竞争格局分析及压力预警指数，自动生成结构化投资日报，重点标注异常信号与投资建议。',
            22
        );
        await delay(600);

        document.getElementById('skillSaveBtn').click();
        await delay(900);

        appendMessage(
            '演示完成！🎉<br><br>您已学会完整的技能使用流程：<br>' +
            '<strong>① 创建技能</strong> → 填写名称与指令<br>' +
            '<strong>② 使用技能</strong> → 一键运行自动分析<br>' +
            '<strong>③ 修改技能</strong> → 随时调整优化<br><br>' +
            '现在可以创建您自己的专属技能了！',
            'agent'
        );

        if (demoBtn) {
            demoBtn.disabled = false;
            demoBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> 重播演示';
        }
    }

    run();
}
